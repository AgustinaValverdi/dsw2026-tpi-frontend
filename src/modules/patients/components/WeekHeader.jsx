import { formatWeekRange } from '../../shared/helpers/dates';

const LEGEND = [
  { label: 'Disponible', color: 'bg-med-primary-900' },
  { label: 'Ocupado', color: 'bg-med-danger-text' },
  { label: 'Pasado', color: 'bg-gray-300' },
  { label: 'Seleccionado', color: 'bg-emerald-400' },
];

const navClass =
  'px-2 py-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition disabled:opacity-40 disabled:cursor-not-allowed';

function WeekHeader({ days, canGoBack, onChangeWeek }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-med-border-subtle">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Semana anterior"
          disabled={!canGoBack}
          onClick={() => onChangeWeek(-1)}
          className={navClass}
        >
          ‹
        </button>
        <span className="font-bold text-sm sm:text-base text-med-primary-900">
          {formatWeekRange(days[0].date, days[days.length - 1].date)}
        </span>
        <button
          type="button"
          aria-label="Semana siguiente"
          onClick={() => onChangeWeek(1)}
          className={navClass}
        >
          ›
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-med-text-sub">
        {LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${item.color}`} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default WeekHeader;
