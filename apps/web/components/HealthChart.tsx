"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { MonthlyHealthPoint } from "@leaflens/shared";

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const W = 720;
const H = 240;
const PAD_L = 44;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 30;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

function formatMonth(month: string): string {
  const [year, mo] = month.split("-");
  return `${MONTHS_ID[Number(mo) - 1]} ${year.slice(2)}`;
}

function confidenceColor(value: number): string {
  if (value >= 0.75) return "#16A34A";
  if (value >= 0.5) return "#EAB308";
  return "#DC2626";
}

function buildSegments(points: MonthlyHealthPoint[]) {
  const xAt = (i: number) =>
    points.length === 1 ? PAD_L + INNER_W / 2 : PAD_L + (i * INNER_W) / (points.length - 1);
  const yAt = (v: number) => PAD_T + (1 - v) * INNER_H;

  const segments: string[] = [];
  let current: string[] = [];
  points.forEach((p, i) => {
    if (p.avg_confidence === null) {
      if (current.length > 1) segments.push(current.join(" "));
      current = [];
      return;
    }
    current.push(`${current.length === 0 ? "M" : "L"}${xAt(i)},${yAt(p.avg_confidence)}`);
  });
  if (current.length > 1) segments.push(current.join(" "));
  return { segments, xAt, yAt };
}

export default function HealthChart({ plantId }: { plantId?: string }) {
  const [points, setPoints] = useState<MonthlyHealthPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.fetchMonthlyHealth(plantId);
        if (!cancelled) setPoints(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Gagal memuat grafik kesehatan");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [plantId]);

  const totalScans = useMemo(
    () => points.reduce((sum, p) => sum + p.scan_count, 0),
    [points]
  );

  if (loading) return <p className="text-sm opacity-70">Memuat grafik kesehatan...</p>;
  if (error) return <p className="text-sm text-leaf-alert">{error}</p>;
  if (totalScans === 0)
    return (
      <p className="text-sm opacity-70">
        Belum ada histori scan cukup untuk menampilkan grafik bulanan.
      </p>
    );

  const { segments, xAt, yAt } = buildSegments(points);
  const labelEvery = Math.ceil(points.length / 12);

  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">Indikator Kesehatan Bulanan</h3>
        <span className="text-xs opacity-70">Rata-rata keyakinan AI per bulan</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Grafik indikator kesehatan bulanan">
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line
              x1={PAD_L}
              y1={yAt(v)}
              x2={W - PAD_R}
              y2={yAt(v)}
              stroke="#000"
              strokeOpacity={v === 0 ? 0.25 : 0.08}
            />
            <text x={PAD_L - 8} y={yAt(v) + 4} textAnchor="end" fontSize="11" fillOpacity={0.55}>
              {Math.round(v * 100)}%
            </text>
          </g>
        ))}

        {segments.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#16A34A" strokeWidth="2" strokeLinejoin="round" />
        ))}

        {points.map((p, i) =>
          p.avg_confidence === null ? null : (
            <circle
              key={p.month}
              cx={xAt(i)}
              cy={yAt(p.avg_confidence)}
              r={p.scan_count > 0 ? 4.5 : 3}
              fill={confidenceColor(p.avg_confidence)}
            >
              <title>
                {`${formatMonth(p.month)} — Keyakinan ${Math.round(p.avg_confidence * 100)}% (${p.scan_count} scan)`}
              </title>
            </circle>
          )
        )}

        {points.map((p, i) =>
          i % labelEvery === 0 ? (
            <text key={`label-${p.month}`} x={xAt(i)} y={H - 8} textAnchor="middle" fontSize="11" fillOpacity={0.55}>
              {formatMonth(p.month)}
            </text>
          ) : null
        )}
      </svg>

      <div className="mt-2 flex flex-wrap gap-4 text-xs opacity-80">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-leaf-primary" /> Sehat (&ge;75%)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-leaf-warning" /> Perlu perhatian (50&ndash;74%)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-leaf-alert" /> Kritis (&lt;50%)
        </span>
      </div>
    </div>
  );
}
