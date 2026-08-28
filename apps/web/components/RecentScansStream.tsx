"use client";

import { useEffect, useState } from "react";
import { api, API_BASE } from "@/lib/api";
import type { HistoryItem } from "@leaflens/shared";
import { History, ArrowRight, ShieldCheck, AlertCircle, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function Pulse({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-xl bg-slate-200/70 dark:bg-slate-700/50 ${className ?? ""}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentScansStream() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.fetchHistory();
        if (active) setItems(data.slice(0, 4)); // Get top 4 recent scans
      } catch {
        // silent fallback
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mb-5 flex items-center gap-3">
          <Pulse className="h-10 w-10 rounded-2xl" />
          <div className="space-y-2">
            <Pulse className="h-4 w-48" />
            <Pulse className="h-3 w-64" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3.5 rounded-2xl border border-slate-200/70 bg-white/80 p-3.5 dark:border-slate-800/70 dark:bg-slate-950/40">
              <Pulse className="h-14 w-14 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Pulse className="h-3 w-3/4" />
                <Pulse className="h-2.5 w-1/2" />
                <Pulse className="h-4 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
            <History className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white">
                Aktivitas Scan Terbaru
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <Sparkles className="h-2.5 w-2.5" /> Real-time
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Riwayat sampel daun terakhir yang diidentifikasi oleh AI
            </p>
          </div>
        </div>

        <Link
          href="/history"
          className="group flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-1.5 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-emerald-400 dark:hover:bg-slate-800"
        >
          Lihat Semua <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const confidence = Math.round(item.confidence * 100);
          const isHealthy = item.confidence >= 0.75;

          return (
            <div
              key={item.scan_id}
              className="group relative overflow-hidden flex items-center gap-3.5 rounded-2xl border border-slate-200/70 bg-white/80 p-3.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-white hover:shadow-md dark:border-slate-800/70 dark:bg-slate-950/40 dark:hover:bg-slate-900/90"
            >
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url.startsWith("http") ? item.image_url : `${API_BASE}${item.image_url}`}
                  alt={item.identified_name}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                  <History className="h-6 w-6" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-xs font-extrabold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                  {item.identified_name}
                </h4>
                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  {formatDate(item.scanned_at)}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px]">
                  {isHealthy ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <ShieldCheck className="h-3 w-3" /> {confidence}% Akurat
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                      <AlertCircle className="h-3 w-3" /> {confidence}% Confidence
                    </span>
                  )}
                  {item.latitude != null && item.longitude != null && (
                    <a
                      href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      title={`${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`}
                      className="inline-flex items-center gap-0.5 rounded-md bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400"
                    >
                      <MapPin className="h-3 w-3" /> GPS
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

