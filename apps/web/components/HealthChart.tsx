"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { MonthlyHealthPoint } from "@leaflens/shared";
import { LineChart, Calendar, CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from "lucide-react";

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const W = 800;
const H = 260;
const PAD_L = 50;
const PAD_R = 30;
const PAD_T = 24;
const PAD_B = 45;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

function formatMonth(month: string): string {
  const [year, mo] = month.split("-");
  return `${MONTHS_ID[Number(mo) - 1]} ${year.slice(2)}`;
}

function confidenceColor(value: number): string {
  if (value >= 0.75) return "#10b981"; // Emerald
  if (value >= 0.5) return "#f59e0b"; // Amber
  return "#ef4444"; // Red
}

/**
 * Creates smooth SVG Cubic Bezier path string from data points
 */
function buildSmoothPath(points: { x: number; y: number }[]): { path: string; areaPath: string } {
  if (points.length === 0) return { path: "", areaPath: "" };
  if (points.length === 1) {
    const p = points[0];
    return {
      path: `M ${p.x - 15},${p.y} L ${p.x + 15},${p.y}`,
      areaPath: `M ${p.x - 15},${H - PAD_B} L ${p.x - 15},${p.y} L ${p.x + 15},${p.y} L ${p.x + 15},${H - PAD_B} Z`,
    };
  }

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) / 2;
    const cp2y = p1.y;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
  }

  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  const bottomY = H - PAD_B;
  const areaD = `${d} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;

  return { path: d, areaPath: areaD };
}

export default function HealthChart({ plantId }: { plantId?: string }) {
  const [points, setPoints] = useState<MonthlyHealthPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<6 | 12>(12);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentMonthStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.fetchMonthlyHealth(plantId, timeframe);
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
  }, [plantId, timeframe]);

  const chartCoords = useMemo(() => {
    if (points.length === 0) return [];
    return points.map((p, i) => {
      const x =
        points.length === 1
          ? PAD_L + INNER_W / 2
          : PAD_L + (i * INNER_W) / (points.length - 1);
      const conf = p.avg_confidence ?? 0;
      const y = PAD_T + (1 - conf) * INNER_H;
      return { x, y, point: p, index: i };
    });
  }, [points]);

  const validCoords = useMemo(() => {
    return chartCoords.filter((c) => c.point.avg_confidence !== null);
  }, [chartCoords]);

  const { path, areaPath } = useMemo(() => {
    return buildSmoothPath(validCoords.map((c) => ({ x: c.x, y: c.y })));
  }, [validCoords]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      {/* Header & Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
            <LineChart className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white">
                Trend Kesehatan & Akurasi AI Bulanan
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <Sparkles className="h-3 w-3" /> Live Tracking
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pemantauan persentase kesehatan & keyakinan AI per bulan secara kontinu
            </p>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-100/70 p-1 dark:border-slate-800 dark:bg-slate-800/70">
          <button
            onClick={() => setTimeframe(6)}
            className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              timeframe === 6
                ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Calendar className="h-3 w-3" /> 6 Bulan
          </button>
          <button
            onClick={() => setTimeframe(12)}
            className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              timeframe === 12
                ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Calendar className="h-3 w-3" /> 12 Bulan
          </button>
        </div>
      </div>

      {/* Chart Canvas State handling */}
      {loading ? (
        <div className="flex h-60 items-center justify-center text-sm font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            Memuat timeline kesehatan...
          </div>
        </div>
      ) : error ? (
        <div className="flex h-60 items-center justify-center text-sm font-medium text-rose-500">
          {error}
        </div>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full overflow-visible"
            role="img"
            aria-label="Grafik indikator kesehatan bulanan"
          >
            <defs>
              <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((v) => {
              const y = PAD_T + (1 - v) * INNER_H;
              return (
                <g key={v}>
                  <line
                    x1={PAD_L}
                    y1={y}
                    x2={W - PAD_R}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeDasharray={v === 0 ? "none" : "4 4"}
                    strokeWidth={v === 0 ? "1.5" : "1"}
                  />
                  <text
                    x={PAD_L - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400 text-[10px] font-semibold dark:fill-slate-500"
                  >
                    {Math.round(v * 100)}%
                  </text>
                </g>
              );
            })}

            {/* Gradient Fill under line */}
            {areaPath && <path d={areaPath} fill="url(#emeraldGradient)" />}

            {/* Smooth Bezier Line */}
            {path && (
              <path
                d={path}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Render ALL Timeline Month Grid Nodes (Active & Inactive) */}
            {chartCoords.map((item) => {
              const isHovered = hoveredIndex === item.index;
              const hasData = item.point.avg_confidence !== null;
              const isCurrentMonth = item.point.month === currentMonthStr;
              const conf = item.point.avg_confidence ?? 0;
              const color = hasData ? confidenceColor(conf) : "#94a3b8";

              return (
                <g
                  key={item.point.month}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIndex(item.index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Vertical Guideline for Current Month */}
                  {isCurrentMonth && (
                    <line
                      x1={item.x}
                      y1={PAD_T}
                      x2={item.x}
                      y2={H - PAD_B}
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="opacity-40"
                    />
                  )}

                  {/* Active Point Circle or Ghost Node */}
                  {hasData ? (
                    <>
                      {/* Glowing halo on hover */}
                      {isHovered && (
                        <circle
                          cx={item.x}
                          cy={item.y}
                          r={13}
                          fill={color}
                          fillOpacity="0.25"
                          className="animate-ping"
                        />
                      )}

                      {/* Outer circle ring */}
                      <circle
                        cx={item.x}
                        cy={item.y}
                        r={isHovered ? 7.5 : 5.5}
                        fill="#ffffff"
                        stroke={color}
                        strokeWidth="3.5"
                        className="transition-all duration-200"
                      />
                    </>
                  ) : (
                    /* Inactive month placeholder dot at bottom grid line */
                    <circle
                      cx={item.x}
                      y1={H - PAD_B}
                      cy={H - PAD_B}
                      r={isHovered ? 4 : 2.5}
                      fill={isHovered ? "#10b981" : "#cbd5e1"}
                      className="transition-all dark:fill-slate-700"
                    />
                  )}

                  {/* Month X-axis Label (Always Visible) */}
                  <text
                    x={item.x}
                    y={H - 14}
                    textAnchor="middle"
                    className={`text-[11px] transition-colors ${
                      isCurrentMonth
                        ? "fill-emerald-600 font-extrabold dark:fill-emerald-400"
                        : isHovered
                        ? "fill-slate-900 font-bold dark:fill-white"
                        : "fill-slate-400 font-medium dark:fill-slate-500"
                    }`}
                  >
                    {formatMonth(item.point.month)}
                  </text>

                  {/* "Bulan Ini" Active Tag */}
                  {isCurrentMonth && (
                    <g transform={`translate(${item.x}, ${H - 2})`}>
                      <rect
                        x="-20"
                        y="-8"
                        width="40"
                        height="12"
                        rx="6"
                        className="fill-emerald-600 dark:fill-emerald-500"
                      />
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        className="fill-white text-[8px] font-black uppercase tracking-wider"
                      >
                        Ini
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Hover Tooltip */}
          {hoveredIndex !== null && chartCoords[hoveredIndex] && (
            <div
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl border border-slate-200/80 bg-slate-900 px-3.5 py-2.5 text-xs text-white shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-950"
              style={{
                left: `${(chartCoords[hoveredIndex].x / W) * 100}%`,
                top: `${
                  chartCoords[hoveredIndex].point.avg_confidence !== null
                    ? (chartCoords[hoveredIndex].y / H) * 100 - 15
                    : ((H - PAD_B) / H) * 100 - 15
                }px`,
              }}
            >
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <span>{formatMonth(chartCoords[hoveredIndex].point.month)}</span>
                {chartCoords[hoveredIndex].point.month === currentMonthStr && (
                  <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-extrabold text-emerald-300">
                    Bulan Ini
                  </span>
                )}
              </div>

              {chartCoords[hoveredIndex].point.avg_confidence !== null ? (
                <>
                  <div className="mt-1 text-slate-300">
                    Rata-rata Akurasi AI:{" "}
                    <span className="font-extrabold text-white">
                      {Math.round((chartCoords[hoveredIndex].point.avg_confidence ?? 0) * 100)}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Total {chartCoords[hoveredIndex].point.scan_count} scan sampel
                  </div>
                </>
              ) : (
                <div className="mt-1 text-[11px] italic text-slate-400">
                  Belum ada data scan pada bulan ini.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 text-xs dark:border-slate-800/60">
        <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Sangat Sehat (&ge;75%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Perlu Perhatian (50&ndash;74%)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
            Gejala Kritis (&lt;50%)
          </span>
        </div>

        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          Pemantauan Kontinu Berkelanjutan
        </span>
      </div>
    </div>
  );
}


