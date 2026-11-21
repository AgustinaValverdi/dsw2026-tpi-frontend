import SlotButton from './SlotButton';

function WeekSlotGrid({ days, selectedSlot, onSelect }) {
  return (
    <div
      className="hidden sm:grid gap-3 pt-5"
      style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
    >
      {days.map((day) => (
        <div key={day.date} className="flex flex-col items-center gap-3">
          <div className="text-center">
            <span className="text-[11px] font-bold text-med-text-sub uppercase">
              {day.short}
            </span>
            <p className="text-xl font-bold text-med-primary-900 leading-tight">
              {day.dateNumber}
            </p>
          </div>

          <div className="w-full flex flex-col gap-2">
            {day.slots.length > 0 ? (
              day.slots.map((slot) => (
                <SlotButton
                  key={slot.id}
                  slot={slot}
                  isSelected={selectedSlot?.id === slot.id}
                  onSelect={onSelect}
                />
              ))
            ) : (
              <div className="h-44 flex items-center justify-center text-center p-2">
                <p className="text-xs text-med-text-muted leading-relaxed">
                  No hay turnos disponibles para este día.
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WeekSlotGrid;
