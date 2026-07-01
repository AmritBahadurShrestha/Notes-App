from datetime import datetime, timezone

from pydantic import BaseModel, Field


class NoteCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(default="", max_length=20000)


class NoteUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(default="", max_length=20000)


class NoteResponse(BaseModel):
    id: str
    title: str
    content: str
    created_at: datetime
    updated_at: datetime


def note_helper(note: dict) -> dict:
    """Convert a MongoDB document into a JSON-serializable dict matching NoteResponse."""
    return {
        "id": str(note["_id"]),
        "title": note["title"],
        "content": note.get("content", ""),
        "created_at": note["created_at"],
        "updated_at": note["updated_at"],
    }


def now_utc() -> datetime:
    return datetime.now(timezone.utc)
