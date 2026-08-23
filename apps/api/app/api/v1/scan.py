from __future__ import annotations

import base64
import json
import uuid

from fastapi import APIRouter, File, Form, UploadFile

from app.core import database
from app.models import LeafScan
from app.schemas import AnalysisResult, ScanResponse
from app.services import ollama_service

router = APIRouter()


@router.post("/scan", response_model=ScanResponse)
async def scan_leaf(
    image_file: UploadFile = File(...),
    source_type: str = Form("upload"),
    location_type: str | None = Form(None),
):
    contents = await image_file.read()
    b64_image = base64.b64encode(contents).decode("utf-8")

    analysis = await ollama_service.analyze_leaf(b64_image)

    scan = LeafScan(
        plant_id=None,
        input_source="camera_capture" if source_type == "camera" else "file_upload",
        location_type=location_type,
        image_url=f"uploads/{uuid.uuid4()}-{image_file.filename}",
        identified_name=analysis.plant_name,
        growth_duration=analysis.growth_time_info.time_to_mature,
        confidence=analysis.confidence_score,
        full_analysis=analysis.model_dump(),
    )
    await database.persist(scan)

    return ScanResponse(scan_id=str(scan.id), result=analysis)
