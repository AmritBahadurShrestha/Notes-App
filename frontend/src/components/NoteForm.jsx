import { useState } from "react";

export default function NoteForm({ initialNote, onSubmit, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give your note a title before saving.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit({ title: title.trim(), content });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-display text-2xl text-ink">
        {initialNote ? "Edit note" : "Pin a new note"}
      </h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-inkfaint mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's this about?"
          className="w-full rounded-md border border-ink/15 bg-white/70 px-3 py-2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-amber"
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-inkfaint mb-1">
          Note
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write it down..."
          rows={6}
          className="w-full rounded-md border border-ink/15 bg-white/70 px-3 py-2 text-ink font-body focus:outline-none focus:ring-2 focus:ring-amber resize-none"
        />
      </div>

      {error && <p className="text-sm text-coral">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-inkfaint hover:bg-ink/5 font-body font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-md bg-amber text-white font-body font-semibold hover:bg-amber/90 disabled:opacity-60 transition-colors"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
