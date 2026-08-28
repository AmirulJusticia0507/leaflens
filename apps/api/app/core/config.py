from __future__ import annotations

import os
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    cors_origins: str = "http://localhost:3000"
    database_url: str = "postgresql+asyncpg://leaflens:leaflens@localhost:5432/leaflens"
    storage_dir: str = "uploads"

    # Groq API (replace Ollama)
    groq_api_key: str = ""
    groq_vision_model: str = "qwen/qwen3.6-27b"
    groq_reasoning_model: str = "deepseek-r1-distill-llama-70b"

    # Legacy Ollama (fallback, optional)
    ollama_base_url: str = ""
    ollama_vision_model: str = ""
    ollama_reasoning_model: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings(_env_file=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
