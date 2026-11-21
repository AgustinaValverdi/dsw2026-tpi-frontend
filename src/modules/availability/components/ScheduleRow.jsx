const timeInputClass = (hasError) =>
  `w-full px-2.5 py-2 text-xs bg-white border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600 disabled:bg-gray-50 disabled:text-med-text-muted ${
    hasError ? 'border-red-400' : 'border-med-border'
  }`;

function ScheduleRow({ day, error, onChange, onCopy }) {
  const hasError = Boolean(error);

  return (
    <tr className="align-top">
      <td
        className={`px-5 py-3.5 font-medium ${
          day.active ? 'text-med-text-main' : 'text-med-text-muted'
        }`}
      >
        {day.label}
      </td>
      <td className="px-5 py-3.5">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={day.active}
            onChange={(e) => onChange(day.key, { active: e.target.checked })}
          />
          <span className="relative w-9 h-5 rounded-full bg-gray-300 peer-checked:bg-med-primary-700 transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-med-primary-600" />
          <span className="text-xs text-med-text-sub">
            {day.active ? 'Activo' : 'Inactivo'}
          </span>
        </label>
      </td>
      <td className="px-5 py-3.5">
        <input
          type="time"
          step="1800"
          aria-label={`Entrada ${day.label}`}
          value={day.startTime}
          disabled={!day.active}
          onChange={(e) => onChange(day.key, { startTime: e.target.value })}
          className={timeInputClass(hasError)}
        />
      </td>
      <td className="px-5 py-3.5">
        <input
          type="time"
          step="1800"
          aria-label={`Salida ${day.label}`}
          value={day.endTime}
          disabled={!day.active}
          onChange={(e) => onChange(day.key, { endTime: e.target.value })}
          className={timeInputClass(hasError)}
        />
        {hasError && (
          <p className="text-[11px] text-red-500 font-medium mt-1">{error}</p>
        )}
      </td>
      <td className="px-5 py-3.5 text-right">
        <button
          type="button"
          disabled={!day.active || hasError}
          onClick={() => onCopy(day)}
          title="Copiar este horario a todos los días activos"
          className="p-1.5 rounded-lg text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}

export default ScheduleRow;
