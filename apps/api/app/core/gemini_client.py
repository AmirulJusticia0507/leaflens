from __future__ import annotations

import httpx

from app.core.config import get_settings

settings = get_settings()

LEAF_RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "plant_name": {"type": "STRING"},
        "scientific_name": {"type": "STRING", "nullable": True},
        "plant_category": {"type": "STRING", "nullable": True},
        "plant_type": {"type": "STRING"},
        "growth_time_info": {
            "type": "OBJECT",
            "properties": {
                "time_to_mature": {"type": "STRING"},
                "lifespan": {"type": "STRING"},
                "growth_rate": {"type": "STRING"},
            },
            "required": ["time_to_mature", "lifespan", "growth_rate"],
        },
        "leaf_characteristics": {"type": "STRING"},
        "care_summary": {"type": "STRING"},
        "health_status": {"type": "STRING"},
        "treatment_steps": {"type": "ARRAY", "items": {"type": "STRING"}},
        "confidence_score": {"type": "NUMBER"},
    },
    "required": [
        "plant_name", "plant_type", "growth_time_info", "leaf_characteristics",
        "care_summary", "health_status", "treatment_steps", "confidence_score",
    ],
}


async def gemini_vision(
    model: str,
    prompt: str,
    image_base64: str,
    mime_type: str = "image/jpeg",
    temperature: float = 0.2,
    max_tokens: int = 2048,
) -> str:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY belum diatur")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": mime_type, "data": image_base64}},
                ],
            }
        ],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
            "responseMimeType": "application/json",
            "responseSchema": LEAF_RESPONSE_SCHEMA,
        },
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            url,
            params={"key": settings.gemini_api_key},
            json=payload,
        )
        resp.raise_for_status()
        data = resp.json()

    return data["candidates"][0]["content"]["parts"][0]["text"]
