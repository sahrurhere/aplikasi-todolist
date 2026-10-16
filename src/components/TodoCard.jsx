import { useState } from 'react';
import { STATUSES, STATUS_MAP } from '../constants/status';

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const inputClass =
  'w-full rounded-lg border border-border bg-surface-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent';

export default function TodoCard({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [draftNote, setDraftNote] = useState(todo.note);
  const [error, setError] = useState('');

  const isDone = todo.status === 'done';
  const status = STATUS_MAP[todo.status] ?? STATUS_MAP.none;

  function startEdit() {
    setDraftTitle(todo.title);
    setDraftNote(todo.note);
    setError('');
    setIsEditing(true);
  }

  function saveEdit(e) {
    e.preventDefault();
    if (!draftTitle.trim()) {
      setError('Judul tugas tidak boleh kosong.');
      return;
    }
    onUpdate(todo.id, { title: draftTitle.trim(), note: draftNote.trim() });
    setIsEditing(false);
  }

  function handleDelete() {
    if (window.confirm(`Hapus tugas "${todo.title}"?`)) {
      onDelete(todo.id);
    }
  }

  // ---------- Mode edit ----------
  if (isEditing) {
    return (
      <form
        onSubmit={saveEdit}
        className="space-y-3 rounded-xl border border-accent/50 bg-surface p-4"
      >
        <input
          type="text"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          maxLength={120}
          aria-label="Edit judul"
          autoFocus
          className={inputClass}
        />
        <textarea
          value={draftNote}
          onChange={(e) => setDraftNote(e.target.value)}
          rows={3}
          placeholder="Catatan (opsional)..."
          aria-label="Edit catatan"
          className={`${inputClass} resize-y text-sm placeholder:text-muted`}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:text-text"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-on-accent transition hover:bg-accent-hover"
          >
            Simpan
          </button>
        </div>
      </form>
    );
  }

  // ---------- Mode tampil ----------
  return (
    <article
      className={`rounded-xl border border-border bg-surface p-4 transition duration-200 hover:bg-surface-2 ${
        isDone ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`break-words font-semibold ${isDone ? 'line-through' : ''}`}>
          {todo.title}
        </h3>

        <select
          value={todo.status}
          onChange={(e) => onUpdate(todo.id, { status: e.target.value })}
          aria-label="Status tugas"
          className={`shrink-0 cursor-pointer rounded-lg border px-2 py-1 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent ${status.badge}`}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-surface text-text">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {todo.note && (
        <p className="mt-2 line-clamp-2 whitespace-pre-line text-sm text-muted">
          {todo.note}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <time dateTime={todo.createdAt} className="text-xs text-muted">
          {dateFormatter.format(new Date(todo.createdAt))}
        </time>
        <div className="flex gap-2">
          <button
            onClick={startEdit}
            className="rounded-lg border border-accent px-3 py-1 text-sm text-accent transition hover:bg-accent hover:text-on-accent"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg px-3 py-1 text-sm text-danger transition hover:bg-danger/10"
          >
            Hapus
          </button>
        </div>
      </div>
    </article>
  );
}