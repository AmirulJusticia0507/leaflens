from __future__ import annotations

import uuid
from collections import defaultdict
from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.core import database
from app.models import LeafScan, Plant
from app.schemas import HistoryItem, MonthlyHealthPoint, PlantPublic

router = APIRouter()


def _shift_month(year: int, month: int, delta: int) -> tuple[int, int]:
    total = year * 12 + (month - 1) + delta
    return total // 12, total % 12 + 1


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


@router.get("/history/monthly-health", response_model=list[MonthlyHealthPoint])
async def monthly_health(plant_id: str | None = None, months: int = 12):
    if not 1 <= months <= 36:
        raise HTTPException(status_code=422, detail="months harus antara 1 dan 36")

    scans = await database.fetch_all(LeafScan, plant_id=uuid.UUID(plant_id) if plant_id else None)
    confidences_by_month: dict[str, list[float]] = defaultdict(list)
    for s in scans:
        confidences_by_month[s.scanned_at.strftime("%Y-%m")].append(s.confidence)

    now = datetime.now()
    points = []
    for offset in range(months - 1, -1, -1):
        year, month = _shift_month(now.year, now.month, -offset)
        key = f"{year:04d}-{month:02d}"
        values = confidences_by_month.get(key, [])
        points.append(
            MonthlyHealthPoint(
                month=key,
                scan_count=len(values),
                avg_confidence=round(sum(values) / len(values), 4) if values else None,
            )
        )
    return points
