"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Sprout, Activity, ScanLine, Sparkles, TrendingUp } from "lucide-react";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    plantCount: 0,
    scanCount: 0,
    avgConfidence: 0,
    healthyCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [plants, history] = await Promise.all([
          api.fetchPlants().catch(() => []),
          api.fetchHistory().catch(() => []),
        ]);

        if (!active) return;

        const plantCount = plants.length;
        const scanCount = history.length;

        const totalConf = history.reduce((sum, h) => sum + (h.confidence || 0), 0);
        const avgConfidence = scanCount > 0 ? Math.round((totalConf / scanCount) * 100) : 0;

        const healthyScans = history.filter((h) => h.confidence >= 0.75).length;
        const healthyCount = scanCount > 0 ? Math.round((healthyScans / scanCount) * 100) : 100;

        setStats({ plantCount, scanCount, avgConfidence, healthyCount });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    {
      title: "Tanaman Dipantau",
      value: loading ? "..." : stats.plantCount.toString(),
      unit: "Tanaman aktif",
      badge: "Terdaftar di tracker",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      icon: Sprout,
      gradient: "from-emerald-500 to-teal-600",
      glowColor: "group-hover:border-emerald-500/50",
    },
    {
      title: "Indeks Kesehatan",
      value: loading ? "..." : `${stats.healthyCount}%`,
      unit: "Kondisi sangat baik",
      badge: stats.healthyCount >= 75 ? "Optimal" : "Perlu perhatian",
      badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      icon: Activity,
      gradient: "from-teal-500 to-cyan-600",
      glowColor: "group-hover:border-teal-500/50",
    },
    {
      title: "Total Scan AI",
      value: loading ? "..." : stats.scanCount.toString(),
      unit: "Analisis dilakukan",
      badge: "Local AI",
      badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      icon: ScanLine,
      gradient: "from-emerald-600 to-emerald-700",
      glowColor: "group-hover:border-indigo-500/50",
    },
    {
      title: "Akurasi Vision AI",
      value: loading ? "..." : `${stats.avgConfidence}%`,
      unit: "Tingkat presisi model",
      badge: "Llama3 Vision",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      icon: Sparkles,
      gradient: "from-amber-500 to-emerald-600",
      glowColor: "group-hover:border-amber-500/50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-slate-800/80 dark:bg-slate-900/80 ${card.glowColor}`}
          >
            {/* Top Row: Title & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${card.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Middle Row: Big Stat Number */}
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {card.value}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.unit}
              </span>
            </div>

            {/* Bottom Row: Status Badge */}
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/60">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${card.badgeColor}`}
              >
                <TrendingUp className="h-3 w-3" />
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
