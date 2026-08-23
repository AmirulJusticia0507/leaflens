from __future__ import annotations

import os

from app.core.config import get_settings

settings = get_settings()


def ensure_storage_dir() -> str:
    path = os.path.join(os.path.dirname(__file__), "..", settings.storage_dir)
    os.makedirs(path, exist_ok=True)
    return path
