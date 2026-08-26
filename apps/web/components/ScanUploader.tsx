"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { queueScan, getPendingScans, removePendingScan, countPending } from "@/lib/offline-queue";
import LeafResultCard from "@/components/LeafResultCard";
import SaveToTrackerForm from "@/components/SaveToTrackerForm";
import type { ScanResponse } from "@leaflens/shared";
import { Camera, Upload, MapPin, StopCircle, Sparkles, AlertCircle, RefreshCw, Navigation, CloudOff } from "lucide-react";

const LOCATION_TYPES = ["Indoor", "Outdoor", "Liar/Hutan"];

function getPosition(timeoutMs = 8000): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Perangkat tidak mendukung GPS."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: timeoutMs,
      maximumAge: 60_000,
    });
  });
}

export default function ScanUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [locationType, setLocationType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- GPS Tagging ---
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [gpsError, setGpsError] = useState<string | null>(null);

  // --- Offline queue ---
  const [pendingCount, setPendingCount] = useState(0);
  const [queueMsg, setQueueMsg] = useState<string | null>(null);
  useEffect(() => {
    countPending().then(setPendingCount).catch(() => {});
    const onOnline = () => {
      // auto-sync pending when back online
      void syncPending();
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  async function syncPending() {
    const pending = await getPendingScans().catch(() => []);
    for (const p of pending) {
      try {
        const f = new File([p.file], p.fileName, { type: p.fileType });
        await api.uploadScan(f, p.sourceType, p.locationType, p.latitude != null ? { latitude: p.latitude, longitude: p.longitude! } : undefined);
        if (p.id != null) await removePendingScan(p.id);
      } catch {}
    }
    countPending().then(setPendingCount).catch(() => {});
  }

  async function acquirePosition(): Promise<{ latitude: number; longitude: number } | null> {
    if (gpsCoords) return gpsCoords;
    setGpsStatus("loading");
    try {
      const pos = await getPosition();
      const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setGpsCoords(coords);
      setGpsStatus("ok");
      setGpsError(null);
      return coords;
    } catch (e) {
      setGpsStatus("error");
      setGpsError(
        e instanceof GeolocationPositionError && e.code === e.PERMISSION_DENIED
          ? "Izin lokasi ditolak — scan dikirim tanpa koordinat."
          : "Lokasi tidak dapat diambil — scan dikirim tanpa koordinat."
      );
      return null;
    }
  }

  function toggleGps() {
    const next = !gpsEnabled;
    setGpsEnabled(next);
    setGpsError(null);
    if (next) {
      void acquirePosition();
    } else {
      setGpsCoords(null);
      setGpsStatus("idle");
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      setCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setError("Tidak dapat mengakses kamera pada perangkat ini.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  async function captureFromCamera(): Promise<File | null> {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(new File([blob], "capture.jpg", { type: "image/jpeg" }));
          else resolve(null);
        },
        "image/jpeg"
      );
    });
  }

  async function handleFile(file: File, sourceType: "camera" | "upload") {
    setError(null);
    setResult(null);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    setLoading(true);
    setQueueMsg(null);
    try {
      const coords = gpsEnabled ? await acquirePosition() : null;
      const res = await api.uploadScan(file, sourceType, locationType || undefined, coords ?? undefined);
      setResult(res);
      countPending().then(setPendingCount).catch(() => {});
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Terjadi kesalahan saat memproses gambar.";
      const isOffline = !navigator.onLine || msg.toLowerCase().includes("failed to fetch") || msg.includes("NetworkError");
      if (isOffline) {
        try {
          const coords = gpsCoords ?? (gpsEnabled ? await acquirePosition().catch(() => null) : null);
          await queueScan({
            file,
            fileName: file.name,
            fileType: file.type,
            sourceType,
            locationType: locationType || undefined,
            latitude: coords?.latitude,
            longitude: coords?.longitude,
          });
          const c = await countPending();
          setPendingCount(c);
          setQueueMsg(`Jaringan offline — scan disimpan di antrean lokal (${c} tertunda). Akan otomatis terkirim saat online kembali.`);
          setError(null);
        } catch {
          setError(msg);
        }
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Controls Card */}
      <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-emerald-500" /> Lokasi Tanaman (Opsional)
          </label>
          <select
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
            className="w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            <option value="">-- Pilih Kategori Lokasi --</option>
            {LOCATION_TYPES.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* GPS Tagging Toggle */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={toggleGps}
            aria-pressed={gpsEnabled}
            className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
              gpsEnabled
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-slate-200/80 bg-white text-slate-600 hover:border-emerald-500/30 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Navigation className={`h-3.5 w-3.5 ${gpsEnabled ? "text-emerald-500" : ""}`} />
              Tag Lokasi GPS Otomatis
            </span>
            <span
              className={`relative h-5 w-9 rounded-full transition-colors ${
                gpsEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                  gpsEnabled ? "left-[1.15rem]" : "left-0.5"
                }`}
              />
            </span>
          </button>

          {gpsEnabled && gpsStatus === "loading" && (
            <p className="flex items-center gap-1.5 px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <RefreshCw className="h-3 w-3 animate-spin" /> Mengambil koordinat GPS...
            </p>
          )}
          {gpsStatus === "ok" && gpsCoords && (
            <a
              href={`https://www.google.com/maps?q=${gpsCoords.latitude},${gpsCoords.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-1 text-[11px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              <MapPin className="h-3 w-3" />
              {gpsCoords.latitude.toFixed(5)}, {gpsCoords.longitude.toFixed(5)} — lihat di Maps
            </a>
          )}
          {gpsError && (
            <p className="flex items-center gap-1.5 px-1 text-[11px] font-semibold text-amber-500">
              <AlertCircle className="h-3 w-3 shrink-0" /> {gpsError}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {!cameraOn ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Camera className="h-4 w-4" /> Buka Kamera Direct
            </button>
          ) : (
            <>
              <button
                onClick={async () => {
                  const f = await captureFromCamera();
                  if (f) handleFile(f, "camera");
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Camera className="h-4 w-4" /> Ambil Foto Daun
              </button>
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-500 transition-all hover:bg-rose-500/20"
              >
                <StopCircle className="h-4 w-4" /> Stop Kamera
              </button>
            </>
          )}

          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-100/70 px-4 py-2.5 text-xs font-bold text-slate-700 backdrop-blur-md transition-all hover:bg-slate-200/70 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800">
            <Upload className="h-4 w-4 text-emerald-500" /> Unggah Foto File
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f, "upload");
              }}
            />
          </label>
        </div>

        {/* Camera Feed or Image Preview */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-950">
          <video
            ref={videoRef}
            muted
            playsInline
            className={`w-full max-h-80 object-cover ${cameraOn ? "" : "hidden"}`}
          />
          {preview && !cameraOn && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Pratinjau daun"
              className="w-full max-h-80 object-contain p-2"
            />
          )}
        </div>

        {/* Loading Spinner State */}
        {loading && (
          <div className="flex items-center justify-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
            <span>AI Llama3 Vision sedang menganalisis sampel daun...</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-bold text-rose-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {queueMsg && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <span className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <CloudOff className="h-4 w-4 shrink-0" /> {queueMsg}
            </span>
            <button
              onClick={() => void syncPending()}
              className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
            >
              Coba Kirim Ulang
            </button>
          </div>
        )}

        {pendingCount > 0 && !queueMsg && (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {pendingCount} scan tertunda (offline)
            </span>
            <button onClick={() => void syncPending()} className="font-bold text-emerald-600 hover:underline">
              Sinkronkan
            </button>
          </div>
        )}
      </div>

      {/* Result & Save Form */}
      {result && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="h-4 w-4 text-emerald-500" /> Hasil Analisis Vision AI
          </div>
          <LeafResultCard result={result.result} />
          <SaveToTrackerForm scanId={result.scan_id} />
        </div>
      )}
    </div>
  );
}

