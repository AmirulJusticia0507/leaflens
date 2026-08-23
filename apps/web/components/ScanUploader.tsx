"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/api";
import LeafResultCard from "@/components/LeafResultCard";
import SaveToTrackerForm from "@/components/SaveToTrackerForm";
import type { ScanResponse } from "@leaflens/shared";
import { Camera, Upload, MapPin, StopCircle, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

const LOCATION_TYPES = ["Indoor", "Outdoor", "Liar/Hutan"];

export default function ScanUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [locationType, setLocationType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
    try {
      const res = await api.uploadScan(file, sourceType, locationType || undefined);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan saat memproses gambar.");
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

