import type {
  ScanResponse,
  HistoryItem,
  PlantPublic,
  PlantCreate,
} from "@leaflens/shared";

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

async function addPlant(payload: PlantCreate): Promise<PlantPublic> {
  const res = await fetch(`${API_BASE}/api/v1/plants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Gagal menyimpan tanaman: ${res.status}`);
  return res.json();
}

async function fetchPlants(): Promise<PlantPublic[]> {
  const res = await fetch(`${API_BASE}/api/v1/plants`);
  if (!res.ok) throw new Error(`Gagal memuat daftar tanaman: ${res.status}`);
  return res.json();
}

export const api = { uploadScan, fetchHistory, addPlant, fetchPlants };
export { API_BASE };
export type { ScanResponse, HistoryItem, PlantPublic, PlantCreate };
