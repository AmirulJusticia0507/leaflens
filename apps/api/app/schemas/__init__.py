from __future__ import annotations

from pydantic import BaseModel, Field


class GrowthTimeInfo(BaseModel):
    time_to_mature: str = Field(..., description="Waktu tumbuh dari benih ke dewasa/panen")
    lifespan: str = Field(..., description="Estimasi usia/umur maksimal")
    growth_rate: str = Field(..., description="Cepat | Sedang | Lambat")


class AnalysisResult(BaseModel):
    """Skema JSON kanonikal (sesuai GUIDELINES.md / FORMS.md)."""

    plant_name: str
    scientific_name: str | None = None
    plant_category: str | None = None
    plant_type: str
    growth_time_info: GrowthTimeInfo
    leaf_characteristics: str
    care_summary: str
    health_status: str | None = Field(
        default=None,
        description="Kondisi daun/tanaman, misal: Sehat | Kurang Air | Sakit",
    )
    treatment_steps: list[str] = Field(
        default_factory=list,
        description="Langkah penanganan konkret bila tanaman tidak sehat",
    )
    confidence_score: float = Field(..., ge=0.0, le=1.0)


class ScanResponse(BaseModel):
    scan_id: str
    result: AnalysisResult


class PlantCreate(BaseModel):
    scan_id: str
    custom_nickname: str
    planting_date: str | None = None


class PlantPublic(BaseModel):
    id: str
    common_name: str
    scientific_name: str | None = None
    plant_type: str
    avg_lifespan: str | None = None
    growth_speed: str | None = None


class HistoryItem(BaseModel):
    scan_id: str
    identified_name: str
    confidence: float
    image_url: str
    scanned_at: str
    location_type: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    health_status: str | None = None


class MonthlyHealthPoint(BaseModel):
    month: str = Field(..., description="Bulan dalam format YYYY-MM")
    scan_count: int
    avg_confidence: float | None = None
