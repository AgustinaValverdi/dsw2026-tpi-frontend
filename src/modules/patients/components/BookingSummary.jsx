import { useState } from 'react';
import Button from '../../shared/components/Button';
import { formatLongDate, weekDayOf } from '../../shared/helpers/dates';

const MIN_REASON_LENGTH = 5;

function BookingSummary({ doctor, slot, submitting, onConfirm }) {
  const [reason, setReason] = useState('');
  const trimmed = reason.trim();
  const reasonError =
    trimmed.length > 0 && trimmed.length < MIN_REASON_LENGTH
      ? `El motivo debe tener al menos ${MIN_REASON_LENGTH} caracteres`
      : '';
  const canConfirm = trimmed.length >= MIN_REASON_LENGTH && !submitting;

  return (
    <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
      <div className="border-l-4 border-med-primary-900 pl-3.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
          Resumen de Selección
        </span>
        <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
          <span>📅</span>
          <span>
            {formatLongDate(slot.date)}, {slot.startTime} HS
          </span>
        </p>
        <p className="text-xs text-med-text-sub mt-0.5">
          {doctor.name} • {weekDayOf(slot.date).label} • Duración: 30 min
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1 flex flex-col gap-1.5">
          <label
            htmlFor="reason"
            className="text-xs font-semibold text-med-text-sub"
          >
            Motivo de la consulta
          </label>
          <input
            id="reason"
            type="text"
            maxLength={300}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Control anual"
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
              reasonError ? 'border-red-400' : 'border-med-border'
            }`}
          />
          {reasonError && (
            <p className="text-xs text-red-500 font-medium">{reasonError}</p>
          )}
        </div>

        <Button
          type="button"
          disabled={!canConfirm}
          onClick={() => onConfirm(trimmed)}
          className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl shadow-md text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{submitting ? 'Reservando...' : 'Confirmar Turno'}</span>
          <svg
            className="w-5 h-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}

export default BookingSummary;
