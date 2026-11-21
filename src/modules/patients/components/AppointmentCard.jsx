import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { formatLongDate, isPast } from '../../shared/helpers/dates';
import { statusInfo } from '../../shared/helpers/appointmentStatus';

function AppointmentCard({ appointment, onCancel }) {
  const status = statusInfo(appointment.status);
  const canCancel =
    appointment.status === 'BOOKED' &&
    !isPast(appointment.date, appointment.startTime);

  return (
    <Card className="flex flex-col justify-between gap-4 p-6">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {appointment.specialtyName ? (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
              {appointment.specialtyName}
            </span>
          ) : (
            <span />
          )}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status.label}
          </span>
        </div>
        <h3 className="text-lg font-bold text-med-primary-900">
          {appointment.doctorName}
        </h3>
        {appointment.date && (
          <p className="text-sm text-med-text-sub mt-2">
            Fecha:{' '}
            <strong className="text-med-text-main font-semibold">
              {formatLongDate(appointment.date)}
            </strong>{' '}
            a las{' '}
            <strong className="text-med-text-main font-semibold">
              {appointment.startTime} hs
            </strong>
          </p>
        )}
        {appointment.reason && (
          <p className="text-xs text-med-text-muted mt-1">
            Motivo: {appointment.reason}
          </p>
        )}
      </div>
      <div className="flex gap-2 pt-3 border-t border-med-border">
        <Button
          variant="outline"
          className="w-full text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canCancel}
          onClick={() => onCancel(appointment)}
        >
          Cancelar Turno
        </Button>
      </div>
    </Card>
  );
}

export default AppointmentCard;
