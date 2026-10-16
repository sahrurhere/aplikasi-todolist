import { useState } from 'react';
import { STATUSES, STATUS_MAP } from '../constants/status';
import { useToast } from '../context/ToastContext';
import {
  formatSchedule,
  getDeadlineState,
  validateDateRange,
} from '../utils/dates';
import Modal from './Modal';
import DateRangeFields from './DateRangeFields';

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const inputClass =
  'w-full rounded-lg border border-border bg-surface-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent';

const DEADLINE_BADGES = {
  overdue: {
    label: 'Terlambat',
    className: 'bg-danger/15 text-danger border-danger/40',
  },
  soon: {
    label: '< 24 jam',
    className: 'bg-status-pending/15 text-status-pending border-status-pending/40',
  },
};

function isLongNote(note) {
  return note.split('\n').length > 2 || note.length > 90;
}

export default function TodoCard({ todo, now, onUpdate, onDelete }) {
  const showToast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const [draftNote, setDraftNote] = useState(todo.note);
  const [draftStartAt, setDraftStartAt] = useState(todo.startAt);
  const [draftDueAt, setDraftDueAt] = useState(todo.dueAt);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const isDone = todo.status === 'done';
  const status = STATUS_MAP[todo.status] ?? STATUS_MAP.none;
  const schedule = formatSchedule(todo.startAt, todo.dueAt);
  const deadlineState = getDeadlineState(todo, now);
  const deadlineBadge = deadlineState ? DEADLINE_BADGES[deadlineState] : null;

  function startEdit() {
    setDraftTitle(todo.title);
    setDraftNote(todo.note);
    setDraftStartAt(todo.startAt);
    setDraftDueAt(todo.dueAt);
    setError('');
    setIsEditing(true);
  }

  function saveEdit(e) {
    e.preventDefault();
    if (!draftTitle.trim()) {
      setError('Judul tugas tidak boleh kosong.');
      return;
    }
    const dateError = validateDateRange(draftStartAt, draftDueAt);
    if (dateError) {
      setError(dateError);
      return;
    }
    onUpdate(todo.id, {
      title: draftTitle.trim(),
      note: draftNote.trim(),
      startAt: draftStartAt,
      dueAt: draftDueAt,
    });
    setIsEditing(false);
    showToast('Tugas diperbarui');
  }

  function handleStatusChange(e) {
    const next = e.target.value;
    onUpdate(todo.id, { status: next });
    showToast(`Status diubah ke ${STATUS_MAP[next].label}`);
  }

  function confirmDelete() {
    setConfirmOpen(false);
    onDelete(todo.id);
    showToast('Tugas dihapus');
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
        <DateRangeFields
          startAt={draftStartAt}
          dueAt={draftDueAt}
          onStartChange={setDraftStartAt}
          onDueChange={setDraftDueAt}
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
      className={`rounded-xl border bg-surface p-4 transition duration-200 hover:bg-surface-2 ${
        deadlineState === 'overdue' ? 'border-danger/50' : 'border-border'
      } ${isDone ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`break-words font-semibold ${isDone ? 'line-through' : ''}`}>
          {todo.title}
        </h3>

        <select
          value={todo.status}
          onChange={handleStatusChange}
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
        <div className="mt-2">
          <p className="line-clamp-2 whitespace-pre-line text-sm text-muted">
            {todo.note}
          </p>
          {isLongNote(todo.note) && (
            <button
              type="button"
              onClick={() => setNoteOpen(true)}
              className="mt-1 text-xs font-medium text-accent hover:underline"
            >
              Lihat selengkapnya
            </button>
          )}
        </div>
      )}

      {schedule && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 ${
              deadlineState === 'overdue' ? 'text-danger' : 'text-muted'
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-3.5 w-3.5"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
            {schedule}
          </span>
          {deadlineBadge && (
            <span
              className={`rounded-full border px-2 py-0.5 font-medium ${deadlineBadge.className}`}
            >
              {deadlineBadge.label}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <time dateTime={todo.createdAt} className="text-xs text-muted">
          Dibuat {dateFormatter.format(new Date(todo.createdAt))}
        </time>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={startEdit}
            className="rounded-lg border border-accent px-3 py-1 text-sm text-accent transition hover:bg-accent hover:text-on-accent"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg px-3 py-1 text-sm text-danger transition hover:bg-danger/10"
          >
            Hapus
          </button>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Hapus tugas?"
        onClose={() => setConfirmOpen(false)}
      >
        <p className="text-sm text-muted">
          Tugas <span className="font-medium text-text">“{todo.title}”</span> akan
          dihapus permanen dan tidak bisa dikembalikan.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={() => setConfirmOpen(false)}
            className="rounded-lg px-3 py-1.5 text-sm text-muted transition hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="rounded-lg bg-danger px-3 py-1.5 text-sm font-semibold text-bg transition hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Hapus
          </button>
        </div>
      </Modal>

      <Modal
        open={noteOpen}
        title={todo.title}
        onClose={() => setNoteOpen(false)}
      >
        <p className="max-h-[60vh] overflow-y-auto whitespace-pre-line text-sm text-muted">
          {todo.note}
        </p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            autoFocus
            onClick={() => setNoteOpen(false)}
            className="rounded-lg border border-accent px-3 py-1.5 text-sm text-accent transition hover:bg-accent hover:text-on-accent"
          >
            Tutup
          </button>
        </div>
      </Modal>
    </article>
  );
}