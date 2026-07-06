const TAPE_COLORS = ["bg-amber", "bg-sage", "bg-coral", "bg-dusk"];
const ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]", "rotate-0"];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function NoteCard({ note, onEdit, onDelete, onTogglePin, onDuplicate }) {
  const hash = hashString(note.id);
  const tape = TAPE_COLORS[hash % TAPE_COLORS.length];
  const rotation = ROTATIONS[hash % ROTATIONS.length];

  return (
    <div
      className={`group relative bg-paper rounded-sm shadow-note hover:shadow-noteHover ${rotation} hover:rotate-0 transition-all duration-200 p-5 pt-7 ${
        note.pinned ? "ring-1 ring-amber/50" : ""
      }`}
    >
      {/* washi tape */}
      <div
        className={`absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 ${tape} opacity-80 rotate-2 rounded-[1px] shadow-sm`}
      />

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-xl text-ink leading-snug break-words">{note.title}</h3>
        <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => onTogglePin(note)}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
            title={note.pinned ? "Unpin note" : "Pin note"}
            className={`p-1.5 rounded hover:bg-ink/10 ${note.pinned ? "text-amber" : "text-inkfaint hover:text-ink"}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={note.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M12 17v5" />
              <path d="M9 3h6l1 6 3 2v2H5v-2l3-2Z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(note)}
            aria-label="Edit note"
            title="Edit note"
            className="p-1.5 rounded hover:bg-ink/10 text-inkfaint hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button
            onClick={() => onDuplicate(note)}
            aria-label="Duplicate note"
            title="Duplicate note"
            className="p-1.5 rounded hover:bg-ink/10 text-inkfaint hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(note)}
            aria-label="Delete note"
            title="Delete note"
            className="p-1.5 rounded hover:bg-coral/10 text-inkfaint hover:text-coral"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          </button>
        </div>
      </div>

      {note.content && (
        <p className="mt-2 text-ink/80 font-body text-sm whitespace-pre-wrap break-words">
          {note.content}
        </p>
      )}

      <p className="mt-4 text-xs text-inkfaint font-body">{formatDate(note.updated_at)}</p>
    </div>
  );
}
