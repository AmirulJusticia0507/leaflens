from __future__ import annotations

from collections.abc import AsyncGenerator
from typing import Any

from sqlmodel import SQLModel, create_async_engine, select
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


async def fetch_all(model: type[SQLModel], **filters) -> list[Any]:
    async with AsyncSession(engine) as session:
        stmt = select(model)
        for key, value in filters.items():
            if value is not None:
                stmt = stmt.where(getattr(model, key) == value)
        result = await session.execute(stmt)
        return list(result.scalars().all())
