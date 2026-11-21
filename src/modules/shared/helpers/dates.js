export const WEEK_DAYS = [
  { key: 'LUNES', label: 'Lunes', short: 'LUN', jsDay: 1 },
  { key: 'MARTES', label: 'Martes', short: 'MAR', jsDay: 2 },
  { key: 'MIERCOLES', label: 'Miércoles', short: 'MIE', jsDay: 3 },
  { key: 'JUEVES', label: 'Jueves', short: 'JUE', jsDay: 4 },
  { key: 'VIERNES', label: 'Viernes', short: 'VIE', jsDay: 5 },
  { key: 'SABADO', label: 'Sábado', short: 'SAB', jsDay: 6 },
  { key: 'DOMINGO', label: 'Domingo', short: 'DOM', jsDay: 0 },
];

const pad = (value) => String(value).padStart(2, '0');

export const toISODate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseISODate = (value) => {
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);

  return new Date(year, month - 1, day);
};

export const addDays = (date, days) => {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
};

export const startOfWeek = (date) => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = (result.getDay() + 6) % 7;

  return addDays(result, -diff);
};

export const toHHmm = (time) => String(time ?? '').slice(0, 5);

export const timeToMinutes = (time) => {
  const [hours, minutes] = toHHmm(time).split(':').map(Number);

  return hours * 60 + minutes;
};

export const minutesToTime = (minutes) =>
  `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

export const isPast = (isoDate, time = '00:00') => {
  const date = parseISODate(isoDate);
  const minutes = timeToMinutes(time);

  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

  return date.getTime() <= Date.now();
};

export const weekDayOf = (isoDate) => {
  const jsDay = parseISODate(isoDate).getDay();

  return WEEK_DAYS.find((day) => day.jsDay === jsDay);
};

const longFormatter = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const monthFormatter = new Intl.DateTimeFormat('es-AR', { month: 'short' });
const monthLongFormatter = new Intl.DateTimeFormat('es-AR', { month: 'long' });

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const formatLongDate = (isoDate) =>
  capitalize(longFormatter.format(parseISODate(isoDate)));

export const formatShortMonth = (isoDate) =>
  monthFormatter.format(parseISODate(isoDate)).replace('.', '').toUpperCase();

export const formatWeekRange = (from, to) => {
  const start = parseISODate(from);
  const end = parseISODate(to);
  const startDay = WEEK_DAYS.find((day) => day.jsDay === start.getDay());
  const endDay = WEEK_DAYS.find((day) => day.jsDay === end.getDay());
  const startMonth = monthLongFormatter.format(start);
  const endMonth = monthLongFormatter.format(end);
  const months =
    startMonth === endMonth ? startMonth : `${startMonth} / ${endMonth}`;

  return `${startDay.label} ${start.getDate()} - ${endDay.label} ${end.getDate()}, ${months}`;
};

const shortFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export const formatShortDate = (isoDate) =>
  shortFormatter.format(parseISODate(isoDate)).replace('.', '');
