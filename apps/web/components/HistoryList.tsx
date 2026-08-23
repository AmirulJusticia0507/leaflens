"use client";

import { useEffect, useState } from "react";
import { api, API_BASE } from "@/lib/api";
import type { HistoryItem } from "@leaflens/shared";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function HistoryList() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.fetchHistory();
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Gagal memuat riwayat");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="text-sm opacity-70">Memuat riwayat...</p>;
  if (error) return <p className="text-sm text-leaf-alert">{error}</p>;
  if (items.length === 0)
    return <p className="text-sm opacity-70">Belum ada riwayat scan.</p>;

  return (
    <ol className="space-y-4 border-l-2 border-leaf-primary/30 pl-4">
      {items.map((item) => (
        <li key={item.scan_id} className="relative">
          <span className="absolute -left-[22px] top-2 h-3 w-3 rounded-full bg-leaf-primary" />
          <div className="flex flex-wrap items-start gap-4 rounded-lg border border-black/10 p-4 shadow-sm">
            {item.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${API_BASE}${item.image_url}`}
                alt={item.identified_name}
                className="h-20 w-20 rounded-md object-cover"
              />
            )}
            <div className="min-w-[200px] flex-1">
              <h3 className="font-semibold">{item.identified_name}</h3>
              <p className="text-xs opacity-70">{formatDate(item.scanned_at)}</p>
              <div className="mt-1 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-black/10">
                <div
                  className={
                    item.confidence >= 0.75
                      ? "h-full bg-leaf-primary"
                      : item.confidence >= 0.5
                        ? "h-full bg-leaf-warning"
                        : "h-full bg-leaf-alert"
                  }
                  style={{ width: `${Math.round(item.confidence * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs opacity-80">
                Keyakinan: {Math.round(item.confidence * 100)}%
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
