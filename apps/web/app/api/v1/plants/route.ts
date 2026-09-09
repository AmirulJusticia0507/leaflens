import { NextResponse } from "next/server";
import { INDONESIAN_PLANTS } from "@leaflens/shared";
import type { PlantPublic } from "@leaflens/shared";

export const runtime = "nodejs";

export async function GET() {
  const plants: PlantPublic[] = INDONESIAN_PLANTS.map((plant, index) => ({
    id: String(index + 1),
    common_name: plant.common_name,
    scientific_name: plant.scientific_name,
    plant_type: plant.plant_type,
    avg_lifespan: plant.avg_lifespan,
    growth_speed: plant.growth_speed,
  }));

  return NextResponse.json(plants);
}
