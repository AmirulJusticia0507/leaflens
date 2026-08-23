from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, Float, Text, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlmodel import Field, SQLModel


class Plant(SQLModel, table=True):
    __tablename__ = "plants"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(PG_UUID(as_uuid=True), primary_key=True,
                         server_default=text("gen_random_uuid()")),
    )
    common_name: str = Field(max_length=150)
    scientific_name: str | None = Field(default=None, max_length=200)
    plant_type: str = Field(max_length=50)
    avg_lifespan: str | None = Field(default=None, max_length=100)
    growth_speed: str | None = Field(default=None, max_length=50)


class LeafScan(SQLModel, table=True):
    __tablename__ = "leaf_scans"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(PG_UUID(as_uuid=True), primary_key=True,
                         server_default=text("gen_random_uuid()")),
    )
    plant_id: uuid.UUID | None = Field(default=None, foreign_key="plants.id")
    input_source: str = Field(max_length=20)
    location_type: str | None = Field(default=None, max_length=20)
    image_url: str = Field(sa_column=Column(Text, nullable=False))
    identified_name: str = Field(max_length=200)
    growth_duration: str = Field(max_length=100)
    confidence: float = Field(sa_column=Column(Float, nullable=False))
    full_analysis: dict = Field(
        default_factory=dict,
        sa_column=Column(JSONB, nullable=False),
    )
    scanned_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(
            TIMESTAMP(timezone=True),
            nullable=False,
            server_default=text("now()"),
        ),
    )
