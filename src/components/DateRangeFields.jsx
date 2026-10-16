const inputClass =
  'mt-1 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent';

export default function DateRangeFields({ startAt, dueAt, onStartChange, onDueChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block">
        <span className="text-xs text-muted">Waktu mulai (opsional)</span>
        <input
          type="datetime-local"
          value={startAt}
          onChange={(e) => onStartChange(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-xs text-muted">Deadline (opsional)</span>
        <input
          type="datetime-local"
          value={dueAt}
          min={startAt || undefined}
          onChange={(e) => onDueChange(e.target.value)}
          className={inputClass}
        />
      </label>
    </div>
  );
}