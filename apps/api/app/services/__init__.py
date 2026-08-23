from __future__ import annotations

from pathlib import Path

from app.core.config import get_settings

settings = get_settings()


def get_storage_path() -> Path:
    """Path absolut direktori storage gambar (apps/api/<storage_dir>)."""
    return Path(__file__).resolve().parent.parent / settings.storage_dir


def ensure_storage_dir() -> str:
    path = get_storage_path()
    path.mkdir(parents=True, exist_ok=True)
    return str(path)
