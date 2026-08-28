from __future__ import annotations

import httpx

from app.core.config import get_settings

settings = get_settings()

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


async def groq_chat(
    model: str,
    messages: list[dict],
    temperature: float = 0.2,
    max_tokens: int = 1024,
    response_format: dict | None = None,
) -> str:
    """Panggil Groq API (OpenAI-compatible chat completions)."""
    payload: dict = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    if response_format:
        payload["response_format"] = response_format

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            GROQ_API_URL,
            json=payload,
            headers={
                "Authorization": f"Bearer {settings.groq_api_key}",
                "Content-Type": "application/json",
            },
        )
        resp.raise_for_status()
        data = resp.json()
    return data["choices"][0]["message"]["content"]


async def groq_vision(
    model: str,
    prompt: str,
    image_base64: str,
    temperature: float = 0.2,
    max_tokens: int = 1024,
) -> str:
    """Panggil Groq vision model dengan gambar base64."""
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_base64}",
                    },
                },
            ],
        }
    ]
    return await groq_chat(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
