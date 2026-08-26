from __future__ import annotations

import httpx

from app.core.config import get_settings

settings = get_settings()


async def ollama_generate(model: str, prompt: str, images: list[str] | None = None) -> str:
    """Panggil Ollama generate API (sync/stream sederhana).

    `images` adalah list base64 (tanpa prefix) untuk model multimodal.
    """
    payload: dict = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json",
        "options": {"num_predict": 400, "temperature": 0.2, "num_ctx": 4096},
    }
    if images:
        payload["images"] = images

    async with httpx.AsyncClient(timeout=300.0) as client:
        resp = await client.post(f"{settings.ollama_base_url}/api/generate", json=payload)
        resp.raise_for_status()
        data = resp.json()
    return data.get("response", "")
