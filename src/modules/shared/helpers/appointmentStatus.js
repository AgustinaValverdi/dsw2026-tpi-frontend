export const APPOINTMENT_STATUS = {
  BOOKED: {
    label: 'Confirmado',
    className: 'bg-med-active-bg text-med-active-text',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-med-danger-bg text-med-danger-text',
  },
  ATTENDED: { label: 'Completado', className: 'bg-slate-100 text-slate-700' },
  NO_SHOW: {
    label: 'Ausente',
    className: 'bg-med-leave-bg text-med-leave-text',
  },
};

export const statusInfo = (status) =>
  APPOINTMENT_STATUS[status] ?? APPOINTMENT_STATUS.BOOKED;
