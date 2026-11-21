import { useState } from 'react';
import { formatShortMonth } from '../../shared/helpers/dates';
import { hasSelectableSlot } from '../helpers/slots';
import SlotButton from './SlotButton';

const keepChipVisible = (chip) => {
  const row = chip?.parentElement;

  if (!row) return;

  const chipEnd = chip.offsetLeft + chip.offsetWidth;

  if (chip.offsetLeft < row.scrollLeft) {
    row.scrollLeft = chip.offsetLeft;
  } else if (chipEnd > row.scrollLeft + row.clientWidth) {
    row.scrollLeft = chipEnd - row.clientWidth;
  }
};

function DayChip({ day, isActive, onClick }) {
  const subText = isActive ? 'text-white/80' : 'text-med-text-sub';
  const mutedText = isActive ? 'text-white/80' : 'text-med-text-muted';
  const chipClass = isActive
    ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-sm'
    : 'bg-white border-med-border text-med-text-main hover:bg-gray-50';

  return (
    <button
      type="button"
      ref={isActive ? keepChipVisible : undefined}
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex-1 min-w-[68px] py-2.5 px-2 rounded-xl text-center border transition-all ${chipClass}`}
    >
      <span className={`block text-[10px] font-bold uppercase ${subText}`}>
        {day.short}
      </span>
      <span className="block text-base font-extrabold my-0.5">
        {day.dateNumber}
      </span>
      <span className={`block text-[10px] uppercase ${mutedText}`}>
        {formatShortMonth(day.date)}
      </span>
    </button>
  );
}

function MobileSlotPicker({ days, selectedSlot, onSelect }) {
  const [chosenDate, setChosenDate] = useState(null);

  const activeDate =
    chosenDate ?? days.find(hasSelectableSlot)?.date ?? days[0]?.date;
  const activeDay = days.find((day) => day.date === activeDate);

  return (
    <div className="block sm:hidden pt-4 space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <DayChip
            key={day.date}
            day={day}
            isActive={activeDate === day.date}
            onClick={() => setChosenDate(day.date)}
          />
        ))}
      </div>

      <div>
        <span className="block text-xs font-bold text-med-text-sub mb-2.5">
          Horarios (Bloques de 30 min)
        </span>

        {activeDay?.slots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {activeDay.slots.map((slot) => (
              <SlotButton
                key={slot.id}
                slot={slot}
                mobile
                isSelected={selectedSlot?.id === slot.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 border border-med-border rounded-xl text-center">
            <p className="text-xs text-med-text-muted">
              No hay turnos disponibles para este día.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileSlotPicker;
