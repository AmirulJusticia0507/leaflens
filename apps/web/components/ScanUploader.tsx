"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/api";
import LeafResultCard from "@/components/LeafResultCard";
import type { ScanResponse } from "@leaflens/shared";

export default function ScanUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function captureFromCamera(): Promise<File | null> {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(new File([blob], "capture.jpg", { type: "image/jpeg" }));
        else resolve(null);
      }, "image/jpeg");
    });
  }

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await api.uploadScan(file, "upload");
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={startCamera}
          className="rounded-md bg-leaf-accent px-3 py-2 text-white"
        >
          Buka Kamera
        </button>
        <button onClick={stopCamera} className="rounded-md border px-3 py-2">
          Stop
        </button>
        <label className="cursor-pointer rounded-md border px-3 py-2">
          Pilih File
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>
        <button
          onClick={async () => {
            const f = await captureFromCamera();
            if (f) handleFile(f);
          }}
          className="rounded-md bg-leaf-primary px-3 py-2 text-white"
        >
          Ambil Foto
        </button>
      </div>

      <video ref={videoRef} className="max-h-72 rounded-md" />
      {preview && <img src={preview} alt="preview" className="max-h-72 rounded-md" />}

      {loading && <p className="text-sm opacity-70">Menganalisis daun...</p>}
      {error && <p className="text-sm text-leaf-alert">{error}</p>}
      {result && <LeafResultCard result={result.result} />}
    </div>
  );
}
