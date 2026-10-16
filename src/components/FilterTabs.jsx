import { STATUSES } from '../constants/status';

const TABS = [{ value: 'all', label: 'Semua' }, ...STATUSES];

export default function FilterTabs({ active, counts, onChange }) {
  return (
    <div
      aria-label="Filter status"
      className="flex gap-1 overflow-x-auto border-b border-border"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.value)}
            className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition ${
              isActive
                ? 'border-accent text-accent'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                isActive ? 'bg-accent text-on-accent' : 'bg-surface-2 text-muted'
              }`}
            >
              {counts[tab.value] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}