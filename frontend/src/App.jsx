import { useEffect, useMemo, useState } from "react";
import NoteCard from "./components/NoteCard.jsx";
import NoteForm from "./components/NoteForm.jsx";
import Modal from "./components/Modal.jsx";
import EmptyState from "./components/EmptyState.jsx";
import { getNotes, createNote, updateNote, deleteNote } from "./services/api.js";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    setLoading(true);
    setError("");
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError("Couldn't reach the notes server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingNote(null);
    setFormOpen(true);
  }

  function openEditForm(note) {
    setEditingNote(note);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingNote(null);
  }

  async function handleSubmit(values) {
    if (editingNote) {
      const updated = await updateNote(editingNote.id, values);
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } else {
      const created = await createNote(values);
      setNotes((prev) => [created, ...prev]);
    }
    closeForm();
  }

  async function confirmDelete() {
    if (!noteToDelete) return;
    const id = noteToDelete.id;
    setNoteToDelete(null);
    const previous = notes;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNote(id);
    } catch (err) {
      setNotes(previous);
      setError("Couldn't delete that note. Try again.");
    }
  }

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-board/90 backdrop-blur-sm border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4 justify-between">
          <h1 className="font-display text-3xl text-ink">Notes</h1>

          <div className="flex items-center gap-3 flex-1 justify-end min-w-[240px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes…"
              className="w-full max-w-xs rounded-md border border-ink/15 bg-white/70 px-3 py-2 text-sm text-ink font-body focus:outline-none focus:ring-2 focus:ring-amber"
            />
            <button
              onClick={openCreateForm}
              className="whitespace-nowrap px-4 py-2 rounded-md bg-amber text-white font-body font-semibold hover:bg-amber/90 transition-colors"
            >
              + New note
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 rounded-md border border-coral/30 bg-coral/10 text-coral px-4 py-3 text-sm font-body">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-inkfaint font-body text-center py-24">Loading notes…</p>
        ) : filteredNotes.length === 0 ? (
          <EmptyState onCreate={openCreateForm} isSearch={Boolean(search.trim())} />
        ) : (
          <div className="note-columns">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEditForm}
                onDelete={setNoteToDelete}
              />
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={formOpen} onClose={closeForm}>
        <NoteForm
          initialNote={editingNote}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitLabel={editingNote ? "Save changes" : "Pin note"}
        />
      </Modal>

      <Modal isOpen={Boolean(noteToDelete)} onClose={() => setNoteToDelete(null)}>
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-ink">Delete this note?</h2>
          <p className="text-ink/70 font-body text-sm">
            "{noteToDelete?.title}" will be removed for good. This can't be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setNoteToDelete(null)}
              className="px-4 py-2 rounded-md text-inkfaint hover:bg-ink/5 font-body font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-md bg-coral text-white font-body font-semibold hover:bg-coral/90 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
