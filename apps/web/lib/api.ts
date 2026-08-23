import type { ScanResponse, HistoryItem } from "@leaflens/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function uploadScan(
  image: Blob,
  sourceType: "camera" | "upload",
  locationType?: string
): Promise<ScanResponse> {
  const form = new FormData();
  form.append("image_file", image);
  form.append("source_type", sourceType);
  if (locationType) form.append("location_type", locationType);

  const res = await fetch(`${API_BASE}/api/v1/scan`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Scan gagal: ${res.status}`);
  return res.json();
}

async function fetchHistory(plantId?: string): Promise<HistoryItem[]> {
  const qs = plantId ? `?plant_id=${encodeURIComponent(plantId)}` : "";
  const res = await fetch(`${API_BASE}/api/v1/history${qs}`);
  if (!res.ok) throw new Error(`History gagal: ${res.status}`);
  return res.json();
}

export const api = { uploadScan, fetchHistory };
export type { ScanResponse, HistoryItem };