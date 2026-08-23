"use client";

import { useEffect, useState } from "react";
import { api, API_BASE } from "@/lib/api";
import type { HistoryItem } from "@leaflens/shared";
import { Calendar, ShieldCheck, AlertTriangle, AlertCircle, Camera } from "lucide-react";
import Link from "next/link";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.fetchHistory();
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Gagal memuat riwayat");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-md animate-pulse dark:border-slate-800 dark:bg-slate-900/60"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-center text-sm font-semibold text-rose-500">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-white/40 p-8 text-center backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <Camera className="h-6 w-6" />
        </div>
        <h4 className="mt-3 font-bold text-slate-800 dark:text-slate-200">
          Belum Ada Riwayat Scan
        </h4>
        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          Setiap kali kamu mengunggah atau memotret daun tanaman, riwayat analisis AI akan tercatat otomatis di sini.
        </p>
        <Link
          href="/scan"
          className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
        >
          <Camera className="h-4 w-4" /> Mulai Scan Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="relative space-y-4 before:absolute before:left-3.5 before:top-3 before:h-[calc(100%-24px)] before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
      {items.map((item) => {
        const confPercent = Math.round(item.confidence * 100);
        const isHealthy = item.confidence >= 0.75;
        const isWarning = item.confidence >= 0.5 && item.confidence < 0.75;

        return (
          <div key={item.scan_id} className="relative flex items-start gap-4 pl-8">
            {/* Timeline Dot */}
            <div
              className={`absolute left-1.5 top-5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-125 dark:border-slate-900 ${
                isHealthy
                  ? "bg-emerald-500"
                  : isWarning
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
            />

            {/* Content Glass Card */}
            <div className="group flex flex-1 flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md transition-all hover:border-emerald-500/40 hover:shadow-md sm:flex-row sm:items-center dark:border-slate-800/80 dark:bg-slate-900/80">
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${API_BASE}${item.image_url}`}
                  alt={item.identified_name}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105"
                />
              )}

              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                    {item.identified_name}
                  </h3>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(item.scanned_at)}
                  </span>
                </div>

                {/* Confidence Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Tingkat Keyakinan AI</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {confPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isHealthy
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : isWarning
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${confPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-1">
                  {isHealthy ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" /> Hasil Identifikasi Akurat
                    </span>
                  ) : isWarning ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <AlertTriangle className="h-3.5 w-3.5" /> Perlu Pemeriksaan Lanjutan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500">
                      <AlertCircle className="h-3.5 w-3.5" /> Foto Kurang Jelas / Sampel Rendah
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

