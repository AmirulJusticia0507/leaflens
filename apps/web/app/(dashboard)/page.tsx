import Link from "next/link";
import PlantsOverview from "@/components/PlantsOverview";
import HealthChart from "@/components/HealthChart";
import DashboardStats from "@/components/DashboardStats";
import RecentScansStream from "@/components/RecentScansStream";
import LeafIcon from "@/components/LeafIcon";

import { Camera, Sparkles, ArrowRight, ShieldCheck, Zap, Activity, HeartPulse } from "lucide-react";

export default function DashboardPage() {
  return (
    <section className="space-y-8 pb-8">
      {/* Ultra Modern Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-10 text-white shadow-xl dark:from-emerald-900/90 dark:via-teal-950 dark:to-slate-900 border border-emerald-500/30">
        {/* Glow Blobs */}
        <div className="pointer-events-none absolute -right-12 -top-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-32 h-80 w-80 rounded-full bg-teal-300/15 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-white/10 blur-2xl" />

        {/* Floating Watermark Leaf */}
        <LeafIcon className="absolute -bottom-8 -right-6 h-56 w-56 rotate-12 opacity-15 transition-transform duration-700 hover:scale-105" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-4 max-w-2xl">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                Model AI Aktif · High Precision
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-200 backdrop-blur-md border border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                100% Pemrosesan Lokal & Privat
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl drop-shadow-sm">
                Dashboard Pemantauan <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">Tanaman</span>
              </h1>
              <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed max-w-xl font-normal">
                Analisis kesehatan daun, deteksi penyakit tanaman secara akurat, dan pantau tren perkembangan tanaman kesayanganmu dengan AI lokal terpercaya.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/scan"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 shadow-lg shadow-black/10 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-50 hover:shadow-xl active:scale-[0.98]"
              >
                <Camera className="h-4.5 w-4.5 text-emerald-600 transition-transform duration-300 group-hover:rotate-12" />
                <span>Mulai Scan Daun</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/history"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/50 active:scale-[0.98]"
              >
                <span>Lihat Riwayat Scan</span>
              </Link>
            </div>
          </div>

          {/* Quick AI Mini Metric Card */}
          <div className="shrink-0 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md shadow-inner lg:w-72 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-100">
              <span className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-300 animate-pulse" />
                Status Performa AI
              </span>
              <span className="rounded-md bg-emerald-400/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-200">
                Optimal
              </span>
            </div>
            <div className="space-y-1.5 border-t border-white/10 pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-white/80">Kecepatan Inferensi</span>
                <span className="font-bold text-white">&lt; 50 ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/80">Rata-rata Akurasi</span>
                <span className="font-bold text-emerald-300">&ge; 98.4%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/80">Mode Privasi</span>
                <span className="font-bold text-teal-200">On-Device</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" /> Metrics & Ringkasan Performa
          </h2>
        </div>
        <DashboardStats />
      </div>

      {/* Recent Scans Live Stream Component */}
      <RecentScansStream />

      {/* Monthly Health & Accuracy Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-emerald-500" /> Analisis Trend Kesehatan
          </h2>
        </div>
        <HealthChart />
      </div>

      {/* Saved Plants Tracker Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <LeafIcon className="h-4 w-4 text-emerald-500" /> Koleksi Tanaman Tersimpan
          </h2>
        </div>
        <PlantsOverview />
      </div>
    </section>
  );
}

