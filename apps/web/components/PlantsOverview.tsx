"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { PlantPublic } from "@leaflens/shared";
import { Search, Flower2, Clock, Zap, Leaf, Filter, Camera } from "lucide-react";
import Link from "next/link";

export default function PlantsOverview() {
  const [plants, setPlants] = useState<PlantPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.fetchPlants();
        if (!cancelled) setPlants(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Gagal memuat tanaman");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Extract unique plant types/categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    plants.forEach((p) => {
      if (p.plant_type) set.add(p.plant_type);
    });
    return ["Semua", ...Array.from(set)];
  }, [plants]);

  // Filtered plants based on search and category
  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchQuery =
        plant.common_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (plant.scientific_name &&
          plant.scientific_name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === "Semua" || plant.plant_type === selectedCategory;

      return matchQuery && matchCategory;
    });
  }, [plants, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-44 rounded-2xl border border-slate-200/80 bg-white/60 p-5 backdrop-blur-md animate-pulse dark:border-slate-800 dark:bg-slate-900/60"
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

  return (
    <div className="space-y-5">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari tanaman berdasarkan nama atau spesies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/80 bg-white/70 pl-11 pr-4 py-3 text-xs sm:text-sm font-medium placeholder-slate-400 backdrop-blur-md transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white dark:focus:border-emerald-400"
          />
        </div>

        {/* Filter Pills */}
        {categories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="h-4 w-4 shrink-0 text-slate-400" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 dark:from-emerald-500 dark:to-teal-500"
                    : "border border-slate-200/80 bg-white/70 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {cat === "Semua" ? "Semua" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Plants */}
      {filteredPlants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/80 bg-white/50 p-10 text-center backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/50">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
            <Flower2 className="h-7 w-7" />
          </div>
          <h4 className="mt-4 text-base font-extrabold text-slate-900 dark:text-slate-100">
            {plants.length === 0 ? "Belum Ada Tanaman Tersimpan" : "Tanaman Tidak Ditemukan"}
          </h4>
          <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            {plants.length === 0
              ? "Lakukan scan foto daun lalu simpan ke tracker untuk mulai memantau perkembangan kesehatan tanamanmu."
              : "Tidak ada tanaman yang cocok dengan kriteria pencarian atau filter yang kamu pilih."}
          </p>
          {plants.length === 0 && (
            <Link
              href="/scan"
              className="mt-5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Camera className="h-4 w-4" /> Scan Daun Pertama
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/10 dark:border-slate-800/80 dark:bg-slate-900/80 dark:hover:bg-slate-900"
            >
              {/* Header: Plant Name & Badge */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                    {plant.common_name}
                  </h3>
                  {plant.scientific_name && (
                    <p className="text-xs italic text-slate-400 dark:text-slate-500">
                      {plant.scientific_name}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  {plant.plant_type ? plant.plant_type.charAt(0).toUpperCase() + plant.plant_type.slice(1) : "Umum"}
                </span>
              </div>

              {/* Plant Details Grid */}
              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3 text-xs dark:border-slate-800/60">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Estimasi Umur
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {plant.avg_lifespan || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    Kecepatan Tumbuh
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {plant.growth_speed || "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5 text-emerald-500" />
                    Status Tracker
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Terdaftar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

