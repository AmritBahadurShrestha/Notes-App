from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, HTTPException, status

from app.database import get_notes_collection
from app.schemas import NoteCreate, NoteUpdate, note_helper, now_utc

router = APIRouter(prefix="/api/notes", tags=["notes"])


def _object_id(note_id: str) -> ObjectId:
    try:
        return ObjectId(note_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid note id")


@router.get("")
async def list_notes():
    """Return all notes: pinned first, then most recently updated."""
    collection = get_notes_collection()
    notes = []
    async for note in collection.find().sort([("pinned", -1), ("updated_at", -1)]):
        notes.append(note_helper(note))
    return notes


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_note(payload: NoteCreate):
    collection = get_notes_collection()
    timestamp = now_utc()
    document = {
        "title": payload.title,
        "content": payload.content,
        "pinned": False,
        "created_at": timestamp,
        "updated_at": timestamp,
    }
    result = await collection.insert_one(document)
    created = await collection.find_one({"_id": result.inserted_id})
    return note_helper(created)


@router.get("/{note_id}")
async def get_note(note_id: str):
    collection = get_notes_collection()
    note = await collection.find_one({"_id": _object_id(note_id)})
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note_helper(note)


@router.put("/{note_id}")
async def update_note(note_id: str, payload: NoteUpdate):
    collection = get_notes_collection()
    oid = _object_id(note_id)
    result = await collection.update_one(
        {"_id": oid},
        {"$set": {"title": payload.title, "content": payload.content, "updated_at": now_utc()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    updated = await collection.find_one({"_id": oid})
    return note_helper(updated)


@router.patch("/{note_id}/pin")
async def toggle_pin(note_id: str):
    """Flip a note's pinned state. Pinned notes are sorted to the top of the list."""
    collection = get_notes_collection()
    oid = _object_id(note_id)
    note = await collection.find_one({"_id": oid})
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    new_pinned = not note.get("pinned", False)
    await collection.update_one({"_id": oid}, {"$set": {"pinned": new_pinned}})
    updated = await collection.find_one({"_id": oid})
    return note_helper(updated)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: str):
    collection = get_notes_collection()
    result = await collection.delete_one({"_id": _object_id(note_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return None
