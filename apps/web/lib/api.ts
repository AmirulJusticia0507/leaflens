import type {
  ScanResponse,
  HistoryItem,
  MonthlyHealthPoint,
  PlantPublic,
  PlantCreate,
} from "@leaflens/shared";

// Default: same-origin (di-proxy oleh Next.js rewrites ke FastAPI).
// Set NEXT_PUBLIC_API_BASE_URL hanya bila memanggil API langsung tanpa proxy.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

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

async function fetchMonthlyHealth(
  plantId?: string,
  months = 12
): Promise<MonthlyHealthPoint[]> {
  const params = new URLSearchParams({ months: String(months) });
  if (plantId) params.set("plant_id", plantId);
  const res = await fetch(`${API_BASE}/api/v1/history/monthly-health?${params}`);
  if (!res.ok) throw new Error(`Grafik kesehatan gagal: ${res.status}`);
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

export const api = { uploadScan, fetchHistory, fetchMonthlyHealth, addPlant, fetchPlants };
export { API_BASE };
export type { ScanResponse, HistoryItem, MonthlyHealthPoint, PlantPublic, PlantCreate };
