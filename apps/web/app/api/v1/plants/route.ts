import { NextResponse } from "next/server";
import { INDONESIAN_PLANTS } from "@leaflens/shared";
import type { PlantPublic } from "@leaflens/shared";
import { addPlantFromScan, getPlants } from "@/lib/server-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const savedPlants = await getPlants().catch(() => []);
  if (savedPlants.length > 0) return NextResponse.json(savedPlants);

  const plants: PlantPublic[] = INDONESIAN_PLANTS.map((plant, index) => ({
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

  return NextResponse.json(plants);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plant = await addPlantFromScan(String(body.scan_id || ""), String(body.custom_nickname || ""));
    return NextResponse.json(plant);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan tanaman";
    return NextResponse.json({ detail: message }, { status: 400 });
  }
}
