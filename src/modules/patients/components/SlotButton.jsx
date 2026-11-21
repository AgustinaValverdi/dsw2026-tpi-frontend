import { SLOT_TITLE, slotClass } from '../helpers/slots';

function SlotButton({ slot, isSelected, mobile = false, onSelect }) {
  const sizeClass = mobile ? 'py-2 px-2' : 'w-full py-2 px-3 text-center';

  return (
    <button
      type="button"
      disabled={!slot.selectable}
      title={SLOT_TITLE[slot.state]}
      onClick={() => onSelect(slot)}
      className={`${sizeClass} text-xs font-semibold rounded-lg border transition-all ${slotClass(
        { ...slot, isSelected },
        mobile
      )}`}
    >
      {slot.startTime}
    </button>
  );
}

export default SlotButton;
