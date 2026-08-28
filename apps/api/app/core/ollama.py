"""Legacy Ollama helper — now delegates to Groq API.

Kept for backward compatibility. New code should use groq_client directly.
"""
from __future__ import annotations

from app.core.groq_client import groq_vision, groq_chat
from app.core.config import get_settings

settings = get_settings()


async def ollama_generate(model: str, prompt: str, images: list[str] | None = None) -> str:
    """Compatibility wrapper: routes to Groq vision or chat endpoint."""
    if images:
        return await groq_vision(
            model=settings.groq_vision_model,
            prompt=prompt,
            image_base64=images[0],
        )
    return await groq_chat(
        model=settings.groq_reasoning_model,
        messages=[{"role": "user", "content": prompt}],
    )
