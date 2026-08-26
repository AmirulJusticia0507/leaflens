"use client";

import { useState, useMemo } from "react";
import { INDONESIAN_PLANTS, searchPlants } from "@leaflens/shared";
import { Search, Leaf, Sprout } from "lucide-react";

const CATEGORIES = ["Semua", ...Array.from(new Set(INDONESIAN_PLANTS.map((p) => p.category)))];

export default function PlantDatabase() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");

  const filtered = useMemo(() => {
    let list = searchPlants(query);
    if (category !== "Semua") list = list.filter((p) => p.category === category);
    return list;
  }, [query, category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari tanaman, nama ilmiah, atau kategori..."
            className="w-full rounded-xl border border-slate-200/80 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Menampilkan {filtered.length} dari {INDONESIAN_PLANTS.length} tanaman
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div
            key={p.scientific_name}
            className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 backdrop-blur-sm transition hover:border-emerald-500/30 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900/70"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {p.plant_type}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">{p.common_name}</h3>
            <p className="text-xs italic text-slate-500">{p.scientific_name}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {p.category}
              </span>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                {p.growth_speed}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              {p.care_tips}
            </p>
            <p className="mt-1 text-[10px] text-slate-400">Umur: {p.avg_lifespan} · Asal: {p.origin}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
          <Sprout className="h-8 w-8 text-slate-400" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tidak ada tanaman yang cocok.</p>
        </div>
      )}
    </div>
  );
}
