"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/api";
import LeafResultCard from "@/components/LeafResultCard";
import SaveToTrackerForm from "@/components/SaveToTrackerForm";
import type { ScanResponse } from "@leaflens/shared";

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setError("Tidak dapat mengakses kamera.");
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
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Lokasi Tanaman</label>
        <select
          value={locationType}
          onChange={(e) => setLocationType(e.target.value)}
          className="rounded-md border border-black/15 px-3 py-2 text-sm"
        >
          <option value="">-- Pilih (opsional) --</option>
          {LOCATION_TYPES.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {!cameraOn ? (
          <button
            onClick={startCamera}
            className="rounded-md bg-leaf-accent px-3 py-2 text-sm text-white hover:bg-leaf-primary"
          >
            Buka Kamera
          </button>
        ) : (
          <>
            <button
              onClick={async () => {
                const f = await captureFromCamera();
                if (f) handleFile(f, "camera");
              }}
              className="rounded-md bg-leaf-primary px-3 py-2 text-sm text-white hover:bg-leaf-accent"
            >
              Ambil Foto
            </button>
            <button
              onClick={stopCamera}
              className="rounded-md border border-black/15 px-3 py-2 text-sm"
            >
              Stop Kamera
            </button>
          </>
        )}
        <label className="cursor-pointer rounded-md border border-black/15 px-3 py-2 text-sm">
          Unggah File
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

      <video
        ref={videoRef}
        muted
        playsInline
        className={`max-h-72 rounded-md ${cameraOn ? "" : "hidden"}`}
      />
      {preview && !cameraOn && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Pratinjau daun" className="max-h-72 rounded-md" />
      )}

      {loading && (
        <p className="text-sm opacity-70">Menganalisis daun via AI lokal...</p>
      )}
      {error && <p className="text-sm text-leaf-alert">{error}</p>}
      {result && (
        <>
          <LeafResultCard result={result.result} />
          <SaveToTrackerForm scanId={result.scan_id} />
        </>
      )}
    </div>
  );
}
