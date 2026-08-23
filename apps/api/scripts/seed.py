"""Seed database LeafLens dengan data contoh.

Jalankan dari apps/api:
    python -m scripts.seed
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import create_db_and_tables, engine
from app.models import LeafScan, Plant


DEMO_PLANTS = [
    {
        "common_name": "Mangga Harum Manis",
        "scientific_name": "Mangifera indica",
        "plant_type": "tree",
        "avg_lifespan": "30 - 50 tahun",
        "growth_speed": "Sedang",
    },
    {
        "common_name": "Sirih Gading",
        "scientific_name": "Epipremnum aureum",
        "plant_type": "vine",
        "avg_lifespan": "5 - 10 tahun",
        "growth_speed": "Cepat",
    },
    {
        "common_name": "Aloe Vera",
        "scientific_name": "Aloe barbadensis miller",
        "plant_type": "succulent",
        "avg_lifespan": "5 - 25 tahun",
        "growth_speed": "Lambat",
    },
]

DEMO_SCANS = [
    {
        "plant_index": 0,
        "input_source": "camera_capture",
        "location_type": "Outdoor",
        "identified_name": "Mangga Harum Manis",
        "growth_duration": "3 - 5 tahun dari bibit",
        "confidence": 0.92,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Mango_leaf_2.jpg/1280px-Mango_leaf_2.jpg",
        "full_analysis": {
            "plant_name": "Mangga Harum Manis",
            "scientific_name": "Mangifera indica",
            "plant_category": "Pohon Buah Perennial",
            "plant_type": "tree",
            "growth_time_info": {
                "time_to_mature": "3 - 5 tahun dari bibit",
                "lifespan": "30 - 50 tahun",
                "growth_rate": "Sedang",
            },
            "leaf_characteristics": "Bentuk memanjang, ujung runcing, pertulangan menyirip jelas",
            "care_summary": "Siram 2x seminggu, butuh sinar matahari penuh",
            "confidence_score": 0.92,
        },
    },
    {
        "plant_index": 1,
        "input_source": "file_upload",
        "location_type": "Indoor",
        "identified_name": "Sirih Gading",
        "growth_duration": "6 - 12 bulan hingga dewasa",
        "confidence": 0.87,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Epipremnum_aureum_31082012.jpg/1280px-Epipremnum_aureum_31082012.jpg",
        "full_analysis": {
            "plant_name": "Sirih Gading",
            "scientific_name": "Epipremnum aureum",
            "plant_category": "Tanaman Hias Merambat",
            "plant_type": "vine",
            "growth_time_info": {
                "time_to_mature": "6 - 12 bulan hingga dewasa",
                "lifespan": "5 - 10 tahun",
                "growth_rate": "Cepat",
            },
            "leaf_characteristics": "Berbentuk hati, hijau mengkilap dengan corak kuning",
            "care_summary": "Siram saat media kering, cocok di tempat teduh",
            "confidence_score": 0.87,
        },
    },
]


async def seed() -> None:
    await create_db_and_tables()

    async with AsyncSession(engine) as session:
        result = await session.exec(select(Plant))
        if result.first() is not None:
            print("Database sudah berisi data, skip seed.")
            return

        plants: dict[int, Plant] = {}
        for i, data in enumerate(DEMO_PLANTS):
            plant = Plant(**data)
            session.add(plant)
            plants[i] = plant
        await session.commit()

        for i, plant in plants.items():
            await session.refresh(plant)

        base_time = datetime.now(timezone.utc) - timedelta(days=30)
        for j, data in enumerate(DEMO_SCANS):
            scan = LeafScan(
                plant_id=plants[data["plant_index"]].id,
                input_source=data["input_source"],
                location_type=data["location_type"],
                image_url=data["image_url"],
                identified_name=data["identified_name"],
                growth_duration=data["growth_duration"],
                confidence=data["confidence"],
                full_analysis=data["full_analysis"],
                scanned_at=base_time + timedelta(days=j * 7),
            )
            session.add(scan)
        await session.commit()

    print("Seed selesai: 3 plants, 2 leaf_scans.")


if __name__ == "__main__":
    asyncio.run(seed())
