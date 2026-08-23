from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1 import scan, plants, history
from app.core.database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(
    title="LeafLens API",
    description="Local AI Leaf Identification & Monitoring System",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(scan.router, prefix="/api/v1")
app.include_router(plants.router, prefix="/api/v1")
app.include_router(history.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
