import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { validateDateRange } from '../utils/dates';
import DateRangeFields from './DateRangeFields';

const MAX_TITLE = 120;

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [startAt, setStartAt] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [error, setError] = useState('');
  const showToast = useToast();

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError('Judul tugas tidak boleh kosong.');
      return;
    }

    const dateError = validateDateRange(startAt, dueAt);
    if (dateError) {
      setError(dateError);
      return;
    }

    onAdd({ title, note, startAt, dueAt });
    showToast('Tugas ditambahkan');
    setTitle('');
    setNote('');
    setStartAt('');
    setDueAt('');
    setError('');
  }

  function handleTitleChange(e) {
    setTitle(e.target.value);
    if (error) setError('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-border bg-surface p-4"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          maxLength={MAX_TITLE}
          placeholder="Judul tugas baru..."
          aria-label="Judul tugas"
          className="min-w-0 flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 font-semibold text-on-accent transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Tambah
        </button>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Catatan (opsional)..."
        aria-label="Catatan"
        className="w-full resize-y rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
      />

      <DateRangeFields
        startAt={startAt}
        dueAt={dueAt}
        onStartChange={setStartAt}
        onDueChange={setDueAt}
      />

      {error && <p className="text-sm text-danger">{error}</p>}
    </form>
  );
}