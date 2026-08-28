"""Hybrid verification: vision result -> reasoning model cross-check via Groq."""
from __future__ import annotations

import json

from app.core.groq_client import groq_chat
from app.core.config import get_settings
from app.schemas import AnalysisResult

settings = get_settings()

VERIFY_PROMPT = """Kamu adalah validator botani. Diberikan hasil identifikasi daun dari model vision:

{vision_json}

Tugas:
1. Periksa apakah plant_name dan scientific_name konsisten dan masuk akal.
2. Jika ada kejanggalan (mis. "Buku Tulip", "Pohon" sebagai plant_type), perbaiki ke nilai yang paling mungkin.
3. Nilai confidence_score: turunkan jika nama terlihat generik/placeholder, naikkan jika spesifik dan konsisten.
4. Pastikan plant_type salah satu dari: tree | shrub | herb | vine | succulent (lowercase).
5. Kembalikan JSON MURNI dengan struktur sama, hanya field yang diperbaiki. Semua teks Bahasa Indonesia.

JANGAN ubah health_status dan treatment_steps jika sudah ada.
Kembalikan hanya JSON, tanpa markdown."""


async def verify_analysis(vision_result: AnalysisResult) -> AnalysisResult:
    """Panggil reasoning model untuk verifikasi silang. Fallback ke vision_result jika gagal."""
    try:
        prompt = VERIFY_PROMPT.format(vision_json=vision_result.model_dump_json())
        raw = await groq_chat(
            model=settings.groq_reasoning_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=512,
        )
        raw = raw.strip()
        if "```" in raw:
            start = raw.find("{")
            end = raw.rfind("}") + 1
            raw = raw[start:end]
        data = json.loads(raw)
        merged = vision_result.model_dump()
        for key in ("plant_name", "scientific_name", "plant_category", "plant_type", "confidence_score"):
            if key in data and data[key] is not None:
                if key == "plant_type":
                    pt = str(data[key]).lower()
                    if pt in ("tree", "shrub", "herb", "vine", "succulent"):
                        merged[key] = pt
                elif key == "scientific_name" and str(data[key]).lower() in ("null", "none", ""):
                    merged[key] = None
                else:
                    merged[key] = data[key]
        try:
            merged["confidence_score"] = max(0.0, min(1.0, float(merged["confidence_score"])))
        except Exception:
            pass
        return AnalysisResult(**merged)
    except Exception:
        return vision_result
