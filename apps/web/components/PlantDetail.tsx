"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { PlantPublic } from "@leaflens/shared";
import { ArrowLeft, Activity, CalendarClock, Clock, Leaf, Sparkles, Zap } from "lucide-react";

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PlantDetail({ id }: { id: string }) {
  const [plant, setPlant] = useState<PlantPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.fetchPlant(id)
      .then((data) => {
        if (active) setPlant(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat detail tanaman");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="h-80 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/70" />;
  }

  if (error || !plant) {
    return (
      <div className="space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-semibold text-rose-500">
          {error || "Tanaman tidak ditemukan"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Kembali ke koleksi
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          {plant.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={plant.image_url} alt={plant.common_name} className="h-[420px] w-full object-cover" />
          ) : (
            <div className="flex h-[420px] items-center justify-center text-slate-400">
              <Leaf className="h-16 w-16" />
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{plant.common_name}</h1>
              {plant.scientific_name && <p className="mt-1 text-sm italic text-slate-500">{plant.scientific_name}</p>}
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {plant.plant_type}
            </span>
          </div>

          <div className="mt-6 grid gap-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
              <span className="flex items-center gap-2 text-slate-500"><Clock className="h-4 w-4" /> Estimasi umur</span>
              <strong className="text-slate-900 dark:text-white">{plant.avg_lifespan || "-"}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
              <span className="flex items-center gap-2 text-slate-500"><Zap className="h-4 w-4 text-amber-500" /> Kecepatan tumbuh</span>
              <strong className="text-slate-900 dark:text-white">{plant.growth_speed || "-"}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
              <span className="flex items-center gap-2 text-slate-500"><Activity className="h-4 w-4 text-emerald-500" /> Status kesehatan</span>
              <strong className="text-slate-900 dark:text-white">{plant.health_status || "-"}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
              <span className="flex items-center gap-2 text-slate-500"><Sparkles className="h-4 w-4 text-emerald-500" /> Confidence</span>
              <strong className="text-slate-900 dark:text-white">{plant.confidence != null ? `${Math.round(plant.confidence * 100)}%` : "-"}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
              <span className="flex items-center gap-2 text-slate-500"><CalendarClock className="h-4 w-4" /> Scan terakhir</span>
              <strong className="text-right text-slate-900 dark:text-white">{formatDate(plant.scanned_at)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
