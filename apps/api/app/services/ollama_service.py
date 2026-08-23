from __future__ import annotations

import json

from app.core.ollama import ollama_generate
from app.core.config import get_settings
from app.schemas import AnalysisResult

settings = get_settings()

SYSTEM_PROMPT = """Kamu adalah ahli botani profesional. Analisis foto daun ini dan ekstrak informasi berikut dalam format JSON MURNI (tanpa teks lain di luar JSON):
{
  "plant_name": "Nama lokal umum",
  "scientific_name": "Nama ilmiah",
  "plant_category": "Kategori bebas",
  "plant_type": "Salah satu dari: tree | shrub | herb | vine | succulent",
  "growth_time_info": {
    "time_to_mature": "Waktu tumbuh dari benih ke dewasa/panen",
    "lifespan": "Estimasi usia/umur maksimal",
    "growth_rate": "Cepat | Sedang | Lambat"
  },
  "leaf_characteristics": "Ciri fisik daun",
  "care_summary": "Saran singkat perawatan",
  "confidence_score": 0.0
}"""


async def analyze_leaf(b64_image: str) -> AnalysisResult:
    raw = await ollama_generate(
        model=settings.ollama_vision_model,
        prompt=SYSTEM_PROMPT,
        images=[b64_image],
    )
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        data = json.loads(raw[start:end])
    return AnalysisResult(**data)
