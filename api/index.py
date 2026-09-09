from __future__ import annotations

import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "apps" / "api"))

from app.api.v1 import history, plants, scan  # noqa: E402

app = FastAPI(title="LeafLens API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router, prefix="/api/v1")
app.include_router(plants.router, prefix="/api/v1")
app.include_router(history.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "runtime": "vercel"}
