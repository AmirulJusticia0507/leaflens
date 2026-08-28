from __future__ import annotations

import json

from app.core.groq_client import groq_vision
from app.core.config import get_settings
from app.schemas import AnalysisResult

settings = get_settings()

SYSTEM_PROMPT = """You are a professional botanist. Analyze this leaf image.
Respond ONLY with valid JSON, no markdown, no extra text. Use EXACTLY these snake_case keys:

{
  "plant_name": "common name in Indonesian",
  "scientific_name": "scientific name or null",
  "plant_category": "category in Indonesian",
  "plant_type": "one of: tree | shrub | herb | vine | succulent",
  "growth_time_info": {
    "time_to_mature": "e.g. 3-5 tahun",
    "lifespan": "e.g. 30-50 tahun",
    "growth_rate": "Cepat | Sedang | Lambat"
  },
  "leaf_characteristics": "1-2 sentences physical description in Indonesian",
  "care_summary": "brief care advice in Indonesian",
  "health_status": "Sehat | or descriptive like Sakit - Bercak Daun",
  "treatment_steps": ["concrete step 1", "concrete step 2"],
  "confidence_score": 0.85
}

Rules:
- All string values MUST be in Indonesian.
- If leaf looks healthy: health_status="Sehat" and 1-2 prevention steps.
- If diseased/damaged: health_status explains the issue and 3-5 concrete treatment steps.
- confidence_score is 0.0-1.0, be realistic (0.7-0.95).
- Do NOT copy the example values above; analyze the actual image."""


def _normalize(data: dict) -> dict:
    """Toleransi untuk model vision yang kurang patuh JSON."""

    gti = data.get("growth_time_info")
    if isinstance(gti, dict):
        norm: dict = {}
        for k, v in gti.items():
            nk = k.strip().lower().replace(" ", "_")
            if nk in ("timetomature", "time_mature"):
                nk = "time_to_mature"
            elif nk in ("life_span",):
                nk = "lifespan"
            elif nk in ("growthrate",):
                nk = "growth_rate"
            norm[nk] = v
        norm.setdefault("time_to_mature", norm.get("lifespan") or "Tidak diketahui")
        norm.setdefault("lifespan", norm.get("time_to_mature") or "Tidak diketahui")
        norm.setdefault("growth_rate", "Sedang")
        data["growth_time_info"] = norm
    else:
        data["growth_time_info"] = {
            "time_to_mature": "Tidak diketahui",
            "lifespan": "Tidak diketahui",
            "growth_rate": "Sedang",
        }

    data.setdefault(
        "leaf_characteristics",
        data.get("characteristics") or "Tidak tersedia",
    )
    data.setdefault("care_summary", data.get("care_tips") or "Perawatan standar sesuai jenis tanaman.")
    if "confidence_score" not in data:
        data["confidence_score"] = data.get("confidence", 0.75)
    try:
        data["confidence_score"] = float(data["confidence_score"])
    except Exception:
        data["confidence_score"] = 0.75
    data["confidence_score"] = max(0.0, min(1.0, data["confidence_score"]))

    data.setdefault("health_status", "Sehat")
    if not isinstance(data.get("treatment_steps"), list):
        data["treatment_steps"] = []
    data.setdefault("plant_name", "Tanaman Tidak Dikenal")
    data.setdefault("plant_type", "herb")

    pt_raw = str(data.get("plant_type", "")).strip().lower()
    mapping = {
        "pohon": "tree", "tree": "tree",
        "semak": "shrub", "shrub": "shrub",
        "herba": "herb", "herb": "herb",
        "merambat": "vine", "vine": "vine",
        "sukulen": "succulent", "succulent": "succulent",
    }
    data["plant_type"] = mapping.get(pt_raw, "herb")

    sci = data.get("scientific_name")
    if isinstance(sci, str) and sci.strip().lower() in ("null", "none", ""):
        data["scientific_name"] = None

    placeholders = {"nama lokal umum", "common name in indonesian", "nama ilmiah"}
    if str(data.get("plant_name", "")).strip().lower() in placeholders:
        data["plant_name"] = "Tanaman Tidak Teridentifikasi"
        data["confidence_score"] = min(float(data.get("confidence_score", 0.5)), 0.5)
    if str(data.get("scientific_name", "")).strip().lower() in placeholders:
        data["scientific_name"] = None
    hs = str(data.get("health_status", "")).lower()
    if "pilih atau sesuaikan" in hs or "choose or" in hs:
        data["health_status"] = "Sehat"

    return data


async def analyze_leaf(b64_image: str) -> AnalysisResult:
    raw = await groq_vision(
        model=settings.groq_vision_model,
        prompt=SYSTEM_PROMPT,
        image_base64=b64_image,
    )
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        data = json.loads(raw[start:end])
    data = _normalize(data)
    return AnalysisResult(**data)
