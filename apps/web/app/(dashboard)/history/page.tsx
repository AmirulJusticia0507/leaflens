import HistoryList from "@/components/HistoryList";
import HealthChart from "@/components/HealthChart";
import { History, Calendar, TrendingUp } from "lucide-react";

export default function HistoryPage() {
  return (
    <section className="space-y-8 pb-8">
      {/* Page Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 sm:p-8 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
              <History className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Riwayat Scan
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Timeline pemantauan perkembangan & analisis daun dari waktu ke waktu.
              </p>
            </div>
          </div>

          {/* Quick info pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Calendar className="h-3.5 w-3.5" /> Timeline Analitik
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <TrendingUp className="h-3.5 w-3.5" /> Trend Akurasi AI
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Health Chart */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          Grafik Trend Kesehatan Bulanan
        </h2>
        <HealthChart />
      </div>

      {/* Scan History Timeline */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-900 dark:text-white">
          <History className="h-4 w-4 text-emerald-500" />
          Semua Riwayat Identifikasi
        </h2>
        <HistoryList />
      </div>
    </section>
  );
}
