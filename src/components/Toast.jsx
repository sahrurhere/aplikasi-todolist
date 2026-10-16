import { useEffect } from 'react';

const DURATION = 2500;

const ICON_STYLES = {
  success: 'bg-accent text-on-accent',
  error: 'bg-danger text-bg',
};

const ICONS = {
  success: '✓',
  error: '!',
};

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), DURATION);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm shadow-lg shadow-black/40 motion-safe:animate-toast-in">
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${ICON_STYLES[toast.type]}`}
      >
        {ICONS[toast.type]}
      </span>
      <p className="flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Tutup notifikasi"
        className="text-lg leading-none text-muted transition hover:text-text"
      >
        ×
      </button>
    </div>
  );
}