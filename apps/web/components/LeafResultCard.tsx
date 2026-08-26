import type { AnalysisResult } from "@leaflens/shared";
import { Sparkles, Info, Clock, Zap, Heart, ShieldCheck, Activity, ListChecks } from "lucide-react";

export function confidenceColor(score: number): string {
  if (score >= 0.75) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 0.5) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-rose-500 bg-rose-500/10 border-rose-500/20";
}

export function healthStatusStyle(status?: string | null): {
  iconColor: string;
  badge: string;
} {
  const s = (status ?? "").toLowerCase();
  if (!s) return { iconColor: "text-slate-400", badge: "bg-slate-500/10 text-slate-600 dark:text-slate-300" };
  if (s.includes("sehat") && !s.includes("sakit"))
    return { iconColor: "text-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };
  if (s.includes("kurang") || s.includes("kelebihan"))
    return { iconColor: "text-amber-500", badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
  return { iconColor: "text-rose-500", badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400" };
}

export default function LeafResultCard({ result }: { result: AnalysisResult }) {
  const confidencePercent = Math.round(result.confidence_score * 100);
  const hasTreatment = (result.treatment_steps?.length ?? 0) > 0;
  const health = healthStatusStyle(result.health_status);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {result.plant_name}
            </h2>
            {result.plant_category && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {result.plant_category}
              </span>
            )}
          </div>
          {result.scientific_name && (
            <p className="text-xs italic text-slate-400 dark:text-slate-500">
              {result.scientific_name}
            </p>
          )}
        </div>

        <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold ${confidenceColor(result.confidence_score)}`}>
          <Sparkles className="h-4 w-4" />
          <span>{confidencePercent}% Akurasi</span>
        </div>
      </div>

      {/* Grid Features */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Info className="h-4 w-4 text-emerald-500" />
            Ciri Khas Daun
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {result.leaf_characteristics}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Heart className="h-4 w-4 text-rose-500" />
            Panduan Perawatan
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {result.care_summary}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4 text-amber-500" />
            Waktu Pertumbuhan
          </div>
          <p className="mt-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Matang: {result.growth_time_info.time_to_mature} &bull; Umur: {result.growth_time_info.lifespan}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Zap className="h-4 w-4 text-emerald-500" />
            Kecepatan Tumbuh
          </div>
          <p className="mt-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {result.growth_time_info.growth_rate}
          </p>
        </div>
      </div>

      {/* Health Status & Treatment Recommendations */}
      {(result.health_status || hasTreatment) && (
        <div className="mt-4 space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/50 dark:bg-slate-950/40">
          {result.health_status && (
            <div className="flex items-center gap-2">
              <Activity className={`h-4 w-4 shrink-0 ${health.iconColor}`} />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Status Kesehatan:</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${health.badge}`}>
                {result.health_status}
              </span>
            </div>
          )}
          {hasTreatment && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <ListChecks className="h-4 w-4 text-emerald-500" />
                Rekomendasi Penanganan
              </div>
              <ol className="mt-2 space-y-1.5">
                {result.treatment_steps!.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

