const formatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const ONE_DAY = 24 * 60 * 60 * 1000;

export function formatDateTime(value) {
  return value ? formatter.format(new Date(value)) : '';
}

export function formatSchedule(startAt, dueAt) {
  if (startAt && dueAt) {
    return `${formatDateTime(startAt)} – ${formatDateTime(dueAt)}`;
  }
  if (dueAt) return `Deadline ${formatDateTime(dueAt)}`;
  if (startAt) return `Mulai ${formatDateTime(startAt)}`;
  return '';
}

export function validateDateRange(startAt, dueAt) {
  if (startAt && dueAt && new Date(dueAt) <= new Date(startAt)) {
    return 'Deadline harus setelah waktu mulai.';
  }
  return '';
}

// Mengembalikan 'overdue', 'soon', atau null
export function getDeadlineState(todo, now) {
  if (!todo.dueAt || todo.status === 'done') return null;
  const remaining = new Date(todo.dueAt).getTime() - now;
  if (remaining < 0) return 'overdue';
  if (remaining <= ONE_DAY) return 'soon';
  return null;
}