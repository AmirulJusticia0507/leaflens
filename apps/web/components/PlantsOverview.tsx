"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PlantPublic } from "@leaflens/shared";

export default function PlantsOverview() {
  const [plants, setPlants] = useState<PlantPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p className="text-sm opacity-70">Memuat tanaman...</p>;
  if (error) return <p className="text-sm text-leaf-alert">{error}</p>;
  if (plants.length === 0)
    return (
      <p className="text-sm opacity-70">
        Belum ada tanaman di tracker. Scan daun lalu simpan ke tracker.
      </p>
    );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {plants.map((plant) => (
        <div
          key={plant.id}
          className="rounded-lg border border-black/10 p-4 shadow-sm"
        >
          <h3 className="font-semibold">{plant.common_name}</h3>
          {plant.scientific_name && (
            <p className="text-xs italic opacity-70">{plant.scientific_name}</p>
          )}
          <dl className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <dt className="opacity-60">Tipe</dt>
              <dd>{plant.plant_type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="opacity-60">Umur</dt>
              <dd>{plant.avg_lifespan ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="opacity-60">Pertumbuhan</dt>
              <dd>{plant.growth_speed ?? "-"}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}
