import { toHHmm } from '../helpers/dates';

const pick = (obj, ...keys) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) return obj[key];
  }

  return undefined;
};

export const toList = (payload) => {
  if (Array.isArray(payload)) return payload;

  return pick(payload, 'data', 'Data', 'items') ?? [];
};

export const toPage = (payload, normalize) => {
  const items = toList(payload).map(normalize);

  return {
    items,
    total: pick(payload, 'total', 'Total') ?? items.length,
  };
};

export const normalizeSpecialty = (raw) => ({
  id: pick(raw, 'id', 'Id', 'specialtyId', 'specialityId'),
  name: pick(raw, 'name', 'Name') ?? '',
  description: pick(raw, 'description', 'Description') ?? '',
});

export const normalizeDoctor = (raw) => {
  const specialty = pick(
    raw,
    'specialty',
    'speciality',
    'Specialty',
    'Speciality'
  );

  const flatSpecialty = {
    id: pick(raw, 'specialtyId', 'specialityId'),
    name: pick(raw, 'specialtyName', 'specialityName') ?? '',
  };

  return {
    id: pick(raw, 'id', 'Id'),
    name: pick(raw, 'name', 'Name') ?? '',
    licenseNumber: pick(raw, 'licenseNumber', 'LicenseNumber') ?? '',
    deleted: pick(raw, 'deleted', 'Deleted') === true,
    specialty: specialty ? normalizeSpecialty(specialty) : flatSpecialty,
  };
};

export const normalizeSlotStatus = (status) => {
  const value = String(status ?? 'AVAILABLE').toUpperCase();

  if (['BOOKED', 'RESERVADO', 'OCUPADO'].includes(value)) return 'BOOKED';

  if (['BLOCKED', 'BLOQUEADO'].includes(value)) return 'BLOCKED';

  if (['PAST', 'PASADO'].includes(value)) return 'PAST';

  return 'AVAILABLE';
};

export const normalizeSlot = (raw) => ({
  id: pick(raw, 'id', 'Id', 'availabilityId', 'slotId'),
  date: String(pick(raw, 'date', 'slotDate', 'Date', 'SlotDate') ?? '').slice(
    0,
    10
  ),
  startTime: toHHmm(pick(raw, 'startTime', 'StartTime')),
  endTime: toHHmm(pick(raw, 'endTime', 'EndTime')),
  status:
    pick(raw, 'isBooked', 'IsBooked') === true
      ? 'BOOKED'
      : normalizeSlotStatus(pick(raw, 'status', 'Status')),
});

export const normalizeAvailabilityRule = (raw) => ({
  day: String(pick(raw, 'day', 'Day', 'dayOfWeek') ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase(),
  startTime: toHHmm(pick(raw, 'startTime', 'StartTime')),
  endTime: toHHmm(pick(raw, 'endTime', 'EndTime')),
});

export const normalizeAppointment = (raw) => {
  const slot = pick(raw, 'availabilitySlot', 'slot', 'availability') ?? {};
  const doctor = pick(raw, 'doctor', 'Doctor');
  const specialty = pick(raw, 'specialty', 'speciality') ?? doctor?.specialty;

  return {
    id: pick(raw, 'id', 'Id', 'appointmentsId', 'appointmentId'),
    date: String(
      pick(raw, 'date', 'slotDate') ?? pick(slot, 'date', 'slotDate') ?? ''
    ).slice(0, 10),
    startTime: toHHmm(pick(raw, 'startTime') ?? pick(slot, 'startTime')),
    doctorName:
      (typeof doctor === 'string' ? doctor : doctor?.name) ??
      pick(raw, 'doctorName') ??
      '',
    specialtyName:
      (typeof specialty === 'string' ? specialty : specialty?.name) ??
      pick(raw, 'specialtyName') ??
      '',
    reason: pick(raw, 'reason') ?? '',
    patientName: pick(raw.patient ?? {}, 'fullName', 'name') ?? '',
    patientDni: pick(raw.patient ?? {}, 'dni', 'Dni') ?? null,
    status: String(
      pick(
        raw,
        'status',
        'Status',
        'appointmentsStatus',
        'appointmentStatus'
      ) ?? 'BOOKED'
    ).toUpperCase(),
  };
};
