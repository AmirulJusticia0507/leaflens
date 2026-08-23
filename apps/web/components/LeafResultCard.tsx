import type { AnalysisResult } from "@/lib/types";

export function confidenceColor(score: number): string {
  if (score >= 0.75) return "text-leaf-primary";
  if (score >= 0.5) return "text-leaf-warning";
  return "text-leaf-alert";
}

export default function LeafResultCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="rounded-lg border border-black/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{result.plant_name}</h2>
          {result.scientific_name && (
            <p className="italic opacity-70">{result.scientific_name}</p>
          )}
        </div>
        <span className={`font-bold ${confidenceColor(result.confidence_score)}`}>
          {Math.round(result.confidence_score * 100)}%
        </span>
      </div>

      <dl className="mt-3 space-y-1 text-sm">
        <div>
          <dt className="font-medium">Kategori</dt>
          <dd className="opacity-80">{result.plant_category ?? "-"}</dd>
        </div>
        <div>
          <dt className="font-medium">Ciri Daun</dt>
          <dd className="opacity-80">{result.leaf_characteristics}</dd>
        </div>
        <div>
          <dt className="font-medium">Waktu Tumbuh</dt>
          <dd className="opacity-80">{result.growth_time_info.time_to_mature}</dd>
        </div>
        <div>
          <dt className="font-medium">Estimasi Umur</dt>
          <dd className="opacity-80">{result.growth_time_info.lifespan}</dd>
        </div>
        <div>
          <dt className="font-medium">Kecepatan Tumbuh</dt>
          <dd className="opacity-80">{result.growth_time_info.growth_rate}</dd>
        </div>
        <div>
          <dt className="font-medium">Perawatan</dt>
          <dd className="opacity-80">{result.care_summary}</dd>
        </div>
      </dl>
    </div>
  );
}
