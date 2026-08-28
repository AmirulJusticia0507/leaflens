from __future__ import annotations

import base64
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.core import database
from app.models import LeafScan
from app.schemas import AnalysisResult, ScanResponse
from app.services import get_storage_path
from app.services.ollama_service import analyze_leaf
from app.services.verification_service import verify_analysis

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_BYTES = 10 * 1024 * 1024


def _save_image(contents: bytes, content_type: str) -> str:
    ext = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }[content_type]
    filename = f"{uuid.uuid4().hex}{ext}"
    storage = get_storage_path()
    storage.mkdir(parents=True, exist_ok=True)
    (storage / filename).write_bytes(contents)
    return f"/uploads/{filename}"


@router.post("/scan", response_model=ScanResponse)
async def scan_leaf(
    image_file: UploadFile = File(...),
    source_type: str = Form("upload"),
    location_type: str | None = Form(None),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
):
    contents = await image_file.read()

    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Ukuran file maksimal 10MB")
    if image_file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=415, detail="Tipe file harus JPG/PNG/WEBP")
    if location_type not in (None, "", "Indoor", "Outdoor", "Liar/Hutan"):
        raise HTTPException(status_code=422, detail="location_type tidak valid")
    if latitude is not None and not -90.0 <= latitude <= 90.0:
        raise HTTPException(status_code=422, detail="latitude harus di antara -90 dan 90")
    if longitude is not None and not -180.0 <= longitude <= 180.0:
        raise HTTPException(status_code=422, detail="longitude harus di antara -180 dan 180")

    image_url = _save_image(contents, image_file.content_type)

    b64_image = base64.b64encode(contents).decode("utf-8")
    try:
        analysis: AnalysisResult = await analyze_leaf(b64_image)
        # Hybrid verification jika confidence rendah atau nama generik
        if analysis.confidence_score < 0.85 or len(analysis.plant_name.split()) <= 1:
            try:
                analysis = await verify_analysis(analysis)
            except Exception:
                pass
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menganalisis gambar: {exc}",
        )

    scan = LeafScan(
        plant_id=None,
        input_source="camera_capture" if source_type == "camera" else "file_upload",
        location_type=location_type or None,
        latitude=latitude,
        longitude=longitude,
        image_url=image_url,
        identified_name=analysis.plant_name,
        growth_duration=analysis.growth_time_info.time_to_mature,
        confidence=analysis.confidence_score,
        full_analysis=analysis.model_dump(),
    )
    await database.persist(scan)

    return ScanResponse(scan_id=str(scan.id), result=analysis)
