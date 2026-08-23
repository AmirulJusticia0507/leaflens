from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException

from app.core import database
from app.models import LeafScan, Plant
from app.schemas import HistoryItem, PlantPublic

router = APIRouter()


@router.get("/plants", response_model=list[PlantPublic])
async def list_plants():
    plants = await database.fetch_all(Plant)
    return [PlantPublic(**p.model_dump()) for p in plants]


@router.get("/plants/{plant_id}", response_model=PlantPublic)
async def get_plant(plant_id: str):
    plants = await database.fetch_all(Plant, id=uuid.UUID(plant_id))
    if not plants:
        raise HTTPException(status_code=404, detail="Plant tidak ditemukan")
    return PlantPublic(**plants[0].model_dump())


@router.get("/history", response_model=list[HistoryItem])
async def scan_history(plant_id: str | None = None):
    scans = await database.fetch_all(LeafScan, plant_id=uuid.UUID(plant_id) if plant_id else None)
    items = [
        HistoryItem(
            scan_id=str(s.id),
            identified_name=s.identified_name,
            confidence=s.confidence,
            image_url=s.image_url,
            scanned_at=s.scanned_at.isoformat(),
        )
        for s in sorted(scans, key=lambda x: x.scanned_at, reverse=True)
    ]
    return items
