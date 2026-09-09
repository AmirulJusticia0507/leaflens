import { NextResponse } from "next/server";
import { getPlant } from "@/lib/server-db";
import { INDONESIAN_PLANTS } from "@leaflens/shared";
import type { PlantPublic } from "@leaflens/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const plant = await getPlant(params.id).catch(() => null);
  if (!plant) {
    const index = Number(params.id) - 1;
    const fallback = INDONESIAN_PLANTS[index];
    if (!fallback) return NextResponse.json({ detail: "Tanaman tidak ditemukan" }, { status: 404 });
    const body: PlantPublic = {
      id: params.id,
      common_name: fallback.common_name,
      scientific_name: fallback.scientific_name,
      plant_type: fallback.plant_type,
      avg_lifespan: fallback.avg_lifespan,
      growth_speed: fallback.growth_speed,
      image_url: null,
      scanned_at: null,
      health_status: null,
      confidence: null,
    };
    return NextResponse.json(body);
  }
  return NextResponse.json(plant);
}
