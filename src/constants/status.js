export const STATUSES = [
  {
    value: 'none',
    label: 'None',
    badge: 'bg-status-none/20 text-muted border-status-none/40',
  },
  {
    value: 'progress',
    label: 'Progres',
    badge: 'bg-status-progress/15 text-status-progress border-status-progress/40',
  },
  {
    value: 'pending',
    label: 'Pending',
    badge: 'bg-status-pending/15 text-status-pending border-status-pending/40',
  },
  {
    value: 'done',
    label: 'Selesai',
    badge: 'bg-accent/15 text-accent border-accent/40',
  },
];

// Versi objek agar mudah dicari: STATUS_MAP['done'].label → 'Selesai'
export const STATUS_MAP = Object.fromEntries(
  STATUSES.map((status) => [status.value, status])
);