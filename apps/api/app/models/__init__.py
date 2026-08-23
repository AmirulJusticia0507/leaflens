from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class Plant(SQLModel, table=True):
    __tablename__ = "plants"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    common_name: str = Field(max_length=150)
    scientific_name: str | None = Field(default=None, max_length=200)
    plant_type: str = Field(max_length=50)
    avg_lifespan: str | None = Field(default=None, max_length=100)
    growth_speed: str | None = Field(default=None, max_length=50)


class LeafScan(SQLModel, table=True):
    __tablename__ = "leaf_scans"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    plant_id: uuid.UUID | None = Field(default=None, foreign_key="plants.id")
    input_source: str = Field(max_length=20)
    location_type: str | None = Field(default=None, max_length=20)
    image_url: str = Field(max_length=2000)
    identified_name: str = Field(max_length=200)
    growth_duration: str = Field(max_length=100)
    confidence: float
    full_analysis: dict = Field(default={})
    scanned_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
