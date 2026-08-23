from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.core import database
from app.models import LeafScan, Plant
from app.schemas import PlantCreate, PlantPublic

router = APIRouter()


def _to_public(p: Plant) -> PlantPublic:
    data = p.model_dump()
    data["id"] = str(data["id"])
    return PlantPublic(**data)


@router.post("/plants", response_model=PlantPublic, status_code=201)
async def add_plant(payload: PlantCreate):
    scans = await database.fetch_all(LeafScan, id=uuid.UUID(payload.scan_id))
    if not scans:
        return JSONResponse(status_code=404, content={"detail": "scan_id tidak ditemukan"})
    scan = scans[0]
    analysis = scan.full_analysis

    plant = Plant(
        common_name=payload.custom_nickname or scan.identified_name,
        scientific_name=analysis.get("scientific_name"),
        plant_type=analysis.get("plant_type", "herb"),
        avg_lifespan=analysis.get("growth_time_info", {}).get("lifespan"),
        growth_speed=analysis.get("growth_time_info", {}).get("growth_rate"),
    )
    await database.persist(plant)

    scan.plant_id = plant.id
    await database.update(scan)

    return _to_public(plant)


@router.get("/plants", response_model=list[PlantPublic])
async def list_plants():
    plants = await database.fetch_all(Plant)
    return [_to_public(p) for p in plants]


@router.get("/plants/{plant_id}", response_model=PlantPublic)
async def get_plant(plant_id: str):
    plants = await database.fetch_all(Plant, id=uuid.UUID(plant_id))
    if not plants:
        raise HTTPException(status_code=404, detail="Plant tidak ditemukan")
    return _to_public(plants[0])
