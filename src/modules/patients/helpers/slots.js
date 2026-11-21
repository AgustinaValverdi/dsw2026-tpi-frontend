import {
  WEEK_DAYS,
  addDays,
  isPast,
  parseISODate,
  toISODate,
} from '../../shared/helpers/dates';

export const SLOT_TITLE = {
  BOOKED: 'Turno ocupado',
  PAST: 'Horario pasado',
};

export const slotState = (slot) => {
  if (slot.status === 'BOOKED' || slot.status === 'BLOCKED') return 'BOOKED';

  if (slot.status === 'PAST' || isPast(slot.date, slot.startTime)) {
    return 'PAST';
  }

  return 'AVAILABLE';
};

export const slotClass = ({ state, isSelected }, mobile = false) => {
  if (isSelected) {
    return mobile
      ? 'border-2 border-med-primary-900 bg-white text-med-primary-900 font-bold shadow-xs'
      : 'bg-emerald-400 text-white border-emerald-400 shadow-sm';
  }

  if (state === 'BOOKED') {
    return 'bg-med-danger-bg/60 border-med-danger-bg text-med-danger-text line-through cursor-not-allowed';
  }

  if (state === 'PAST') {
    return 'bg-gray-50 border-med-border-subtle text-med-text-muted cursor-not-allowed';
  }

  return 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50';
};

export const buildWeekDays = (slots, weekStart) => {
  const slotsByDate = slots.reduce((acc, slot) => {
    const state = slotState(slot);

    (acc[slot.date] ??= []).push({
      ...slot,
      state,
      selectable: state === 'AVAILABLE',
    });

    return acc;
  }, {});

  return WEEK_DAYS.map((weekDay, index) => {
    const date = toISODate(addDays(weekStart, index));

    return {
      ...weekDay,
      date,
      dateNumber: parseISODate(date).getDate(),
      slots: (slotsByDate[date] ?? []).sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      ),
    };
  }).filter(
    (day) => (day.jsDay >= 1 && day.jsDay <= 5) || day.slots.length > 0
  );
};

export const hasSelectableSlot = (day) =>
  day.slots.some((slot) => slot.selectable);
