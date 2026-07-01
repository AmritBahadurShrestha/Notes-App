export default function EmptyState({ onCreate, isSearch }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <div className="w-14 h-14 rounded-full bg-ink/5 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-inkfaint">
          <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        </svg>
      </div>
      <h2 className="font-display text-2xl text-ink mb-1">
        {isSearch ? "No notes match that search" : "Your board is empty"}
      </h2>
      <p className="text-inkfaint font-body mb-6 max-w-xs">
        {isSearch
          ? "Try a different word, or clear the search to see everything."
          : "Pin your first note to get started."}
      </p>
      {!isSearch && (
        <button
          onClick={onCreate}
          className="px-5 py-2.5 rounded-md bg-amber text-white font-body font-semibold hover:bg-amber/90 transition-colors"
        >
          + New note
        </button>
      )}
    </div>
  );
}
