import type {
  ScanResponse,
  HistoryItem,
  MonthlyHealthPoint,
  PlantPublic,
  PlantCreate,
} from "@leaflens/shared";
import { INDONESIAN_PLANTS } from "@leaflens/shared";

function localPlants(): PlantPublic[] {
  return INDONESIAN_PLANTS.map((plant, index) => ({
    id: String(index + 1),
    common_name: plant.common_name,
    scientific_name: plant.scientific_name,
    plant_type: plant.plant_type,
    avg_lifespan: plant.avg_lifespan,
    growth_speed: plant.growth_speed,
    image_url: null,
    scanned_at: null,
    health_status: null,
    confidence: null,
  }));
}

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const customUrl = localStorage.getItem("leaflens_api_url");
    if (customUrl) return customUrl.replace(/\/$/, "");
  }

  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    if (window.location.protocol === "https:" && process.env.NEXT_PUBLIC_API_BASE_URL == null) {
      return window.location.origin;
    }

    const isCapacitor =
      window.location.protocol === "capacitor:" ||
      window.location.protocol === "file:" ||
      (window as any).Capacitor?.isNativePlatform?.() ||
      (window.location.hostname === "localhost" && window.location.port !== "3000" && window.location.port !== "8000");

    if (isCapacitor) {
      return "http://10.7.183.172:8000";
    }
  }

  return "http://10.7.183.172:8000";
}

async function handleResponse<T>(res: Response, fallbackErrorMsg: string): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || contentType.includes("text/html")) {
    const text = await res.text().catch(() => "");
    if (res.status === 404 || contentType.includes("text/html")) {
      throw new Error(
        `Endpoint API (${baseUrl}) tidak ditemukan (HTTP ${res.status}).`
      );
    }
    throw new Error(`${fallbackErrorMsg} (HTTP ${res.status}): ${text.slice(0, 150)}`);
  }
  try {
    return await res.json();
  } catch {
    throw new Error(`Respons server bukan format JSON yang valid.`);
  }
}

async function uploadScan(
  image: Blob,
  sourceType: "camera" | "upload",
  locationType?: string,
  coords?: { latitude: number; longitude: number }
): Promise<ScanResponse> {
  const form = new FormData();
  form.append("image_file", image);
  form.append("source_type", sourceType);
  if (locationType) form.append("location_type", locationType);
  if (coords) {
    form.append("latitude", String(coords.latitude));
    form.append("longitude", String(coords.longitude));
  }

  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/v1/scan`, {
    method: "POST",
    body: form,
  });
  return handleResponse<ScanResponse>(res, "Scan gagal");
}

async function fetchHistory(plantId?: string): Promise<HistoryItem[]> {
  const baseUrl = getApiBaseUrl();
  const qs = plantId ? `?plant_id=${encodeURIComponent(plantId)}` : "";
  const res = await fetch(`${baseUrl}/api/v1/history${qs}`);
  return handleResponse<HistoryItem[]>(res, "History gagal").catch(() => []);
}

async function fetchMonthlyHealth(
  plantId?: string,
  months = 12
): Promise<MonthlyHealthPoint[]> {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams({ months: String(months) });
  if (plantId) params.set("plant_id", plantId);
  const res = await fetch(`${baseUrl}/api/v1/history/monthly-health?${params}`);
  return handleResponse<MonthlyHealthPoint[]>(res, "Grafik kesehatan gagal").catch(() => []);
}

async function addPlant(payload: PlantCreate): Promise<PlantPublic> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/v1/plants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<PlantPublic>(res, "Gagal menyimpan tanaman");
}

async function fetchPlants(): Promise<PlantPublic[]> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/v1/plants`);
  return handleResponse<PlantPublic[]>(res, "Gagal memuat daftar tanaman").catch(() => localPlants());
}

async function fetchPlant(id: string): Promise<PlantPublic> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/v1/plants/${encodeURIComponent(id)}`);
  return handleResponse<PlantPublic>(res, "Gagal memuat detail tanaman").catch(() => {
    const plant = localPlants().find((item) => item.id === id);
    if (plant) return plant;
    throw new Error("Tanaman tidak ditemukan");
  });
}

export const API_BASE = getApiBaseUrl();
export const api = { uploadScan, fetchHistory, fetchMonthlyHealth, addPlant, fetchPlants, fetchPlant };
export type { ScanResponse, HistoryItem, MonthlyHealthPoint, PlantPublic, PlantCreate };
