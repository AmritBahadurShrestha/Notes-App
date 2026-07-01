from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings


class Database:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


database = Database()


async def connect_to_mongo() -> None:
    """Open the connection pool to MongoDB Atlas. Called once on app startup."""
    database.client = AsyncIOMotorClient(settings.mongodb_uri)
    database.db = database.client[settings.database_name]
    # Fail fast on startup if the URI/credentials are wrong, rather than on the first request.
    await database.client.admin.command("ping")


async def close_mongo_connection() -> None:
    """Close the connection pool. Called once on app shutdown."""
    if database.client:
        database.client.close()


def get_notes_collection():
    return database.db["notes"]
