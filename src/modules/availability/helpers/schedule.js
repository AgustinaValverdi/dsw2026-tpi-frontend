import { WEEK_DAYS, timeToMinutes } from '../../shared/helpers/dates';

const DEFAULT_START = '08:00';
const DEFAULT_END = '12:00';

export const emptySchedule = () =>
  WEEK_DAYS.map((day) => ({
    ...day,
    active: false,
    startTime: DEFAULT_START,
    endTime: DEFAULT_END,
  }));

export const scheduleFromRules = (rules) =>
  emptySchedule().map((day) => {
    const rule = rules.find((r) => r.day === day.key);

    if (!rule) return day;

    return {
      ...day,
      active: true,
      startTime: rule.startTime,
      endTime: rule.endTime,
    };
  });

export const validateDay = (day) => {
  if (!day.active) return '';

  if (!day.startTime || !day.endTime) return 'Completá entrada y salida';

  const start = timeToMinutes(day.startTime);
  const end = timeToMinutes(day.endTime);

  if (start >= end) return 'La entrada debe ser anterior a la salida';

  if (start % 30 !== 0 || end % 30 !== 0) {
    return 'Usá horarios en bloques de 30 min (ej: 08:00, 08:30)';
  }

  return '';
};

export const toActiveDays = (schedule) =>
  schedule
    .filter((day) => day.active)
    .map(({ key, startTime, endTime }) => ({ day: key, startTime, endTime }));
