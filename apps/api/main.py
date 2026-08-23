from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1 import scan, plants, history
from app.core.config import get_settings
from app.core.database import create_db_and_tables
from app.services import ensure_storage_dir

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    ensure_storage_dir()
    yield


app = FastAPI(
    title="LeafLens API",
    description="Local AI Leaf Identification & Monitoring System",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router, prefix="/api/v1")
app.include_router(plants.router, prefix="/api/v1")
app.include_router(history.router, prefix="/api/v1")

app.mount("/uploads", StaticFiles(directory=ensure_storage_dir()), name="uploads")


@app.get("/health")
async def health():
    return {"status": "ok"}
