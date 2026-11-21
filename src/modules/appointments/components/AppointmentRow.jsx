import { formatShortDate } from '../../shared/helpers/dates';
import { statusInfo } from '../../shared/helpers/appointmentStatus';

function AppointmentRow({ appointment }) {
  const status = statusInfo(appointment.status);

  return (
    <tr className="hover:bg-gray-50/70 transition-colors">
      <td className="px-6 py-4">
        <p className="font-bold text-med-primary-900">
          {appointment.date ? formatShortDate(appointment.date) : '-'}
        </p>
        <p className="text-xs text-med-text-muted mt-0.5">
          {appointment.startTime} hs
        </p>
      </td>
      <td className="px-6 py-4">
        <p className="font-semibold text-med-primary-900">
          {appointment.specialtyName || '-'}
        </p>
        <p className="text-xs text-med-text-muted">{appointment.doctorName}</p>
      </td>
      <td className="px-6 py-4">
        <p className="font-semibold text-med-text-main">
          {appointment.patientName || 'Sin nombre'}
        </p>
        <p className="text-xs text-med-text-muted mt-0.5">
          DNI: {appointment.patientDni ?? '-'}
        </p>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {status.label}
        </span>
      </td>
    </tr>
  );
}

export default AppointmentRow;
