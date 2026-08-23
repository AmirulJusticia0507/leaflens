"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { PlantPublic } from "@leaflens/shared";
import { Bookmark, CheckCircle, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function SaveToTrackerForm({ scanId }: { scanId: string }) {
  const [nickname, setNickname] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<PlantPublic | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const plant = await api.addPlant({
        scan_id: scanId,
        custom_nickname: nickname || "Tanaman Tanpa Nama",
        planting_date: plantingDate || undefined,
      });
      setSaved(plant);
      toast.success("Tanaman Tersimpan!", `${plant.common_name} berhasil ditambahkan ke tracker.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan";
      setError(msg);
      toast.error("Gagal Menyimpan", msg);
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs sm:text-sm backdrop-blur-md dark:bg-emerald-950/40">
        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
        <div className="flex-1 text-slate-800 dark:text-slate-200">
          Tersimpan ke tracker sebagai <strong>{saved.common_name}</strong>. Lihat di{" "}
          <Link href="/history" className="font-bold text-emerald-600 underline dark:text-emerald-400">
            riwayat scan
          </Link>
          .
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80"
    >
      <div className="flex items-center gap-2">
        <Bookmark className="h-4 w-4 text-emerald-500" />
        <h3 className="font-bold text-slate-900 dark:text-white">Simpan Ke Tracker Tanaman</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <Tag className="h-3.5 w-3.5" /> Nama Panggilan Tanaman
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder='Misal: "Mangga Belakang Rumah"'
            className="w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs sm:text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" /> Tanggal Tanam (Opsional)
          </label>
          <input
            type="date"
            value={plantingDate}
            onChange={(e) => setPlantingDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>

      {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
      >
        {saving ? "Menyimpan ke Tracker..." : "Simpan Ke Koleksi Tracker"}
      </button>
    </form>
  );
}

