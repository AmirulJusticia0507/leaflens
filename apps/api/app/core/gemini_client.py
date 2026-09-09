from __future__ import annotations

import httpx

from app.core.config import get_settings

settings = get_settings()


async def gemini_vision(
    model: str,
    prompt: str,
    image_base64: str,
    mime_type: str = "image/jpeg",
    temperature: float = 0.2,
    max_tokens: int = 1024,
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
