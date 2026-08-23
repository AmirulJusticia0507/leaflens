"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { PlantPublic } from "@leaflens/shared";

export default function SaveToTrackerForm({ scanId }: { scanId: string }) {
  const [nickname, setNickname] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<PlantPublic | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const plant = await api.addPlant({
        scan_id: scanId,
        custom_nickname: nickname || "Tanaman Tanpa Nama",
        planting_date: plantingDate || undefined,
      });
      setSaved(plant);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="mt-4 rounded-lg border border-leaf-primary/40 bg-leaf-primary/10 p-4 text-sm">
        Tersimpan ke tracker sebagai{" "}
        <strong>{saved.common_name}</strong>. Lihat di{" "}
        <a href="/history" className="text-leaf-accent underline">
          riwayat scan
        </a>
        .
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-black/10 p-4">
      <h3 className="font-semibold">Simpan ke Tracker</h3>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder='Nama panggilan (misal: "Mangga Belakang Rumah")'
        className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
      />
      <input
        type="date"
        value={plantingDate}
        onChange={(e) => setPlantingDate(e.target.value)}
        className="w-full rounded-md border border-black/15 px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-leaf-alert">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-leaf-primary px-4 py-2 text-sm text-white hover:bg-leaf-accent disabled:opacity-50"
      >
        {saving ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
