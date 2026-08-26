from __future__ import annotations

from collections.abc import AsyncGenerator
from typing import Any

from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import get_settings

settings = get_settings()
engine = create_async_engine(settings.database_url, echo=False, future=True)


# Migrasi ringan: tambah kolom baru tanpa menghapus data yang sudah ada.
LIGHTWEIGHT_MIGRATIONS = [
    "ALTER TABLE leaf_scans ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION",
    "ALTER TABLE leaf_scans ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION",
]


async def create_db_and_tables() -> None:
    import app.models  # noqa: F401  (register models)

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        for statement in LIGHTWEIGHT_MIGRATIONS:
            await conn.exec_driver_sql(statement)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        yield session


async def persist(model: SQLModel) -> Any:
    async with AsyncSession(engine) as session:
        session.add(model)
        await session.commit()
        await session.refresh(model)
        return model


async def update(model: SQLModel) -> Any:
    """Update baris yang sudah ada berdasarkan primary key (merge)."""
    async with AsyncSession(engine) as session:
        merged = await session.merge(model)
        await session.commit()
        return merged


async def fetch_all(model: type[SQLModel], **filters) -> list[Any]:
    async with AsyncSession(engine) as session:
        stmt = select(model)
        for key, value in filters.items():
            if value is not None:
                stmt = stmt.where(getattr(model, key) == value)
        result = await session.exec(stmt)
        return list(result.all())


async def seed_initial_data() -> None:
    from app.models import LeafScan, Plant

    scans = await fetch_all(LeafScan)
    if scans:
        # Fill image_url for existing scans if empty
        for s in scans:
            if not s.image_url:
                if "Mangga" in s.identified_name:
                    s.image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Mango_leaf_2.jpg/1280px-Mango_leaf_2.jpg"
                    await update(s)
                elif "Sirih" in s.identified_name:
                    s.image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Epipremnum_aureum_31082012.jpg/1280px-Epipremnum_aureum_31082012.jpg"
                    await update(s)
                elif "Lidah" in s.identified_name or "Aloe" in s.identified_name:
                    s.image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Aloe_vera_leaf.jpg/1280px-Aloe_vera_leaf.jpg"
                    await update(s)

    plants = await fetch_all(Plant)
    if plants:
        return

    mango = Plant(
        common_name="Mangga Manis (Harum Manis)",
        scientific_name="Mangifera indica",
        plant_type="Tree",
        avg_lifespan="100 - 300 tahun",
        growth_speed="Sedang",
    )
    vine = Plant(
        common_name="Sirih Gading (Heartleaf Vine)",
        scientific_name="Epipremnum aureum",
        plant_type="Vine",
        avg_lifespan="5 - 10 tahun",
        growth_speed="Cepat",
    )
    succulent = Plant(
        common_name="Lidah Buaya (Aloe Vera)",
        scientific_name="Aloe barbadensis Miller",
        plant_type="Succulent",
        avg_lifespan="5 - 25 tahun",
        growth_speed="Lambat",
    )

    p1 = await persist(mango)
    p2 = await persist(vine)
    p3 = await persist(succulent)

    # Seed corresponding scans with realistic generated leaf images
    s1 = LeafScan(
        plant_id=p1.id,
        input_source="upload",
        location_type="Outdoor",
        latitude=-6.2088,
        longitude=106.8456,
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Mango_leaf_2.jpg/1280px-Mango_leaf_2.jpg",
        identified_name="Mangga Manis (Harum Manis)",
        growth_duration="3-5 Tahun",
        confidence=0.98,
        full_analysis={
            "scientific_name": "Mangifera indica",
            "plant_type": "Tree",
            "condition": "Sehat",
            "care_tips": "Berikan pupuk organik berkala dan paparan matahari penuh.",
            "health_status": "Sehat",
            "treatment_steps": [
                "Pertahankan paparan matahari penuh minimal 6 jam per hari",
                "Aplikasi pupuk organik setiap 2 bulan",
            ],
            "growth_time_info": {"lifespan": "100 - 300 tahun", "growth_rate": "Sedang"},
        },
    )

    s2 = LeafScan(
        plant_id=p2.id,
        input_source="upload",
        location_type="Indoor",
        latitude=-6.1751,
        longitude=106.8272,
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Epipremnum_aureum_31082012.jpg/1280px-Epipremnum_aureum_31082012.jpg",
        identified_name="Sirih Gading (Heartleaf Vine)",
        growth_duration="1-2 Tahun",
        confidence=0.96,
        full_analysis={
            "scientific_name": "Epipremnum aureum",
            "plant_type": "Vine",
            "condition": "Sehat",
            "care_tips": "Jaga kelembapan tanah dan berikan tiang panjat / tursus.",
            "health_status": "Sehat",
            "treatment_steps": [
                "Siram hanya saat permukaan media tanam kering",
                "Bersihkan daun dari debu agar fotosintesis optimal",
            ],
            "growth_time_info": {"lifespan": "5 - 10 tahun", "growth_rate": "Cepat"},
        },
    )

    s3 = LeafScan(
        plant_id=p3.id,
        input_source="upload",
        location_type="Outdoor",
        latitude=-6.3018,
        longitude=106.6529,
        image_url="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Aloe_vera_leaf.jpg/1280px-Aloe_vera_leaf.jpg",
        identified_name="Lidah Buaya (Aloe Vera)",
        growth_duration="2-4 Tahun",
        confidence=0.99,
        full_analysis={
            "scientific_name": "Aloe barbadensis Miller",
            "plant_type": "Succulent",
            "condition": "Sehat",
            "care_tips": "Siram secara berkala hanya jika media tanam sudah kering total.",
            "health_status": "Sehat",
            "treatment_steps": [
                "Gunakan pot dengan drainase baik",
                "Hindari genangan air di pangkal daun",
            ],
            "growth_time_info": {"lifespan": "5 - 25 tahun", "growth_rate": "Lambat"},
        },
    )

    await persist(s1)
    await persist(s2)
    await persist(s3)


