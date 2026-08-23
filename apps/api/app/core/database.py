from __future__ import annotations

from collections.abc import AsyncGenerator
from typing import Any

from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import get_settings

settings = get_settings()
engine = create_async_engine(settings.database_url, echo=False, future=True)


async def create_db_and_tables() -> None:
    import app.models  # noqa: F401  (register models)

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


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

    # Seed corresponding scans
    s1 = LeafScan(
        plant_id=p1.id,
        input_source="upload",
        location_type="Outdoor",
        image_url="",
        identified_name="Mangga Manis (Harum Manis)",
        growth_duration="3-5 Tahun",
        confidence=0.98,
        full_analysis={
            "scientific_name": "Mangifera indica",
            "plant_type": "Tree",
            "condition": "Sehat",
            "care_tips": "Berikan pupuk organik berkala dan paparan matahari penuh.",
            "growth_time_info": {"lifespan": "100 - 300 tahun", "growth_rate": "Sedang"},
        },
    )

    s2 = LeafScan(
        plant_id=p2.id,
        input_source="upload",
        location_type="Indoor",
        image_url="",
        identified_name="Sirih Gading (Heartleaf Vine)",
        growth_duration="1-2 Tahun",
        confidence=0.96,
        full_analysis={
            "scientific_name": "Epipremnum aureum",
            "plant_type": "Vine",
            "condition": "Sehat",
            "care_tips": "Jaga kelembapan tanah dan berikan tiang panjat / tursus.",
            "growth_time_info": {"lifespan": "5 - 10 tahun", "growth_rate": "Cepat"},
        },
    )

    s3 = LeafScan(
        plant_id=p3.id,
        input_source="upload",
        location_type="Outdoor",
        image_url="",
        identified_name="Lidah Buaya (Aloe Vera)",
        growth_duration="2-4 Tahun",
        confidence=0.99,
        full_analysis={
            "scientific_name": "Aloe barbadensis Miller",
            "plant_type": "Succulent",
            "condition": "Sehat",
            "care_tips": "Siram secara berkala hanya jika media tanam sudah kering total.",
            "growth_time_info": {"lifespan": "5 - 25 tahun", "growth_rate": "Lambat"},
        },
    )

    await persist(s1)
    await persist(s2)
    await persist(s3)

