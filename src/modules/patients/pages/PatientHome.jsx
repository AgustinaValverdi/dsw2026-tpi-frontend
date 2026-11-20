import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import useAuth from '../../auth/hook/useAuth';
import { getErrorMessage } from '../../auth/helpers/backendError';
import {
  createAppointment,
  getDoctorSlots,
  getDoctorsBySpecialty,
  getSpecialties,
} from '../services/bookingService';
import {
  WEEK_DAYS,
  addDays,
  formatLongDate,
  formatShortMonth,
  formatWeekRange,
  isPast,
  parseISODate,
  startOfWeek,
  toISODate,
  weekDayOf,
} from '../../shared/helpers/dates';

const selectClass =
  'w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed';

const MIN_REASON_LENGTH = 5;

function SelectArrow() {
  return (
    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
      ▼
    </span>
  );
}

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

const SLOT_TITLE = {
  BOOKED: 'Turno ocupado',
  PAST: 'Horario pasado',
};

const slotState = (slot) => {
  if (slot.status === 'BOOKED' || slot.status === 'BLOCKED') return 'BOOKED';

  if (slot.status === 'PAST' || isPast(slot.date, slot.startTime)) {
    return 'PAST';
  }

  return 'AVAILABLE';
};

const slotClass = ({ state, isSelected }, mobile = false) => {
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

function PatientHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [specialties, setSpecialties] = useState([]);
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [loadingFilters, setLoadingFilters] = useState(true);

  const [searchedDoctor, setSearchedDoctor] = useState(null);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mobileDate, setMobileDate] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  const currentWeekStart = useMemo(() => startOfWeek(new Date()), []);
  const from = toISODate(weekStart);
  const to = toISODate(addDays(weekStart, 6));

  useEffect(() => {
    let active = true;

    getSpecialties()
      .then((list) => {
        if (!active) return;

        setSpecialties(list);
        setSpecialtyId(list[0]?.id ?? '');
      })
      .catch((error) => active && setErrorMessage(getErrorMessage(error)))
      .finally(() => active && setLoadingFilters(false));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!specialtyId) return undefined;

    let active = true;

    setDoctors([]);
    setDoctorId('');

    getDoctorsBySpecialty(specialtyId)
      .then((list) => {
        if (!active) return;

        setDoctors(list);
        setDoctorId(list[0]?.id ?? '');
      })
      .catch((error) => active && setErrorMessage(getErrorMessage(error)));

    return () => {
      active = false;
    };
  }, [specialtyId]);

  const loadSlots = useCallback(async () => {
    if (!searchedDoctor) return;

    setLoadingSlots(true);

    try {
      setSlots(await getDoctorSlots(searchedDoctor.id, from, to));
    } catch (error) {
      setSlots([]);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoadingSlots(false);
    }
  }, [searchedDoctor, from, to]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleSearch = () => {
    const doctor = doctors.find((doc) => doc.id === doctorId);

    if (!doctor) return;

    setErrorMessage('');
    setSelectedSlot(null);
    setMobileDate(null);
    setSearchedDoctor(doctor);
  };

  const changeWeek = (weeks) => {
    setSelectedSlot(null);
    setMobileDate(null);
    setWeekStart((value) => addDays(value, weeks * 7));
  };

  const days = useMemo(() => {
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
  }, [slots, weekStart]);

  const activeMobileDate =
    mobileDate ??
    days.find((day) => day.slots.some((slot) => slot.selectable))?.date ??
    days[0]?.date;
  const mobileDay = days.find((day) => day.date === activeMobileDate);
  const hasAnySelectable = days.some((day) =>
    day.slots.some((s) => s.selectable)
  );

  const reasonError =
    reason.trim().length > 0 && reason.trim().length < MIN_REASON_LENGTH
      ? `El motivo debe tener al menos ${MIN_REASON_LENGTH} caracteres`
      : '';
  const canConfirm =
    selectedSlot && reason.trim().length >= MIN_REASON_LENGTH && !submitting;

  const handleConfirm = async () => {
    if (!canConfirm) return;

    if (!user?.dni) {
      setErrorMessage(
        'Tu sesión no tiene DNI asociado. Cerrá sesión e ingresá nuevamente.'
      );

      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      await createAppointment({
        doctorId: searchedDoctor.id,
        availabilityId: selectedSlot.id,
        dni: user.dni,
        reason: reason.trim(),
      });

      setConfirmed({ doctor: searchedDoctor, slot: selectedSlot });
      setSelectedSlot(null);
      setReason('');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo reservar el turno.'));

      if (error?.response?.status === 409) setSelectedSlot(null);
    } finally {
      setSubmitting(false);
      loadSlots();
    }
  };

  const noDoctors = !loadingFilters && specialtyId && doctors.length === 0;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <Card className="p-6 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
            Reservar Turno Médico
          </h1>
          <p className="text-xs sm:text-sm text-med-text-sub mt-1">
            Seleccione la especialidad y el profesional para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label
              htmlFor="specialty"
              className="text-xs font-semibold text-med-text-sub"
            >
              Seleccionar Especialidad
            </label>
            <div className="relative">
              <select
                id="specialty"
                value={specialtyId}
                disabled={loadingFilters || specialties.length === 0}
                onChange={(e) => setSpecialtyId(e.target.value)}
                className={selectClass}
              >
                {loadingFilters && <option>Cargando...</option>}
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
              <SelectArrow />
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-1.5">
            <label
              htmlFor="doctor"
              className="text-xs font-semibold text-med-text-sub"
            >
              Seleccionar Doctor
            </label>
            <div className="relative">
              <select
                id="doctor"
                value={doctorId}
                disabled={doctors.length === 0}
                onChange={(e) => setDoctorId(e.target.value)}
                className={selectClass}
              >
                {noDoctors && <option>Sin médicos disponibles</option>}
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              <SelectArrow />
            </div>
          </div>

          <div className="md:col-span-3">
            <Button
              type="button"
              disabled={!doctorId}
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Buscar Disponibilidad</span>
            </Button>
          </div>
        </div>
      </Card>

      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
        >
          {errorMessage}
        </div>
      )}

      {searchedDoctor && (
        <>
          <Card className="p-5 sm:p-6 flex items-center gap-4 border-med-border">
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-med-primary-100 flex items-center justify-center text-3xl border border-med-primary-200">
                🩺
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-base sm:text-lg font-bold text-med-primary-900">
                {searchedDoctor.name}
              </h2>
              <p className="text-xs sm:text-sm font-semibold uppercase sm:normal-case tracking-wide sm:tracking-normal text-med-primary-700 sm:text-med-text-sub mt-0.5">
                {searchedDoctor.specialty?.name}
              </p>
            </div>
          </Card>

          <Card className="p-5 sm:p-6 border-med-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-med-border-subtle">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Semana anterior"
                  disabled={weekStart <= currentWeekStart}
                  onClick={() => changeWeek(-1)}
                  className="px-2 py-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                <span className="font-bold text-sm sm:text-base text-med-primary-900">
                  {formatWeekRange(days[0].date, days[days.length - 1].date)}
                </span>
                <button
                  type="button"
                  aria-label="Semana siguiente"
                  onClick={() => changeWeek(1)}
                  className="px-2 py-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition"
                >
                  ›
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-med-text-sub">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-med-primary-900" />
                  Disponible
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-med-danger-text" />
                  Ocupado
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  Pasado
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Seleccionado
                </span>
              </div>
            </div>

            {loadingSlots ? (
              <p className="py-10 text-center text-sm text-med-text-muted">
                Buscando turnos...
              </p>
            ) : (
              <>
                {!hasAnySelectable && (
                  <p className="pt-4 text-center text-xs text-med-text-muted">
                    Sin disponibilidad esta semana. Probá con la semana
                    siguiente.
                  </p>
                )}

                <div
                  className="hidden sm:grid gap-3 pt-5"
                  style={{
                    gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
                  }}
                >
                  {days.map((day) => (
                    <div
                      key={day.date}
                      className="flex flex-col items-center gap-3"
                    >
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
                          day.slots.map((slot) => {
                            const isSelected = selectedSlot?.id === slot.id;

                            return (
                              <button
                                key={slot.id}
                                type="button"
                                disabled={!slot.selectable}
                                title={SLOT_TITLE[slot.state]}
                                onClick={() => setSelectedSlot(slot)}
                                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${slotClass(
                                  { ...slot, isSelected }
                                )}`}
                              >
                                {slot.startTime}
                              </button>
                            );
                          })
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

                <div className="block sm:hidden pt-4 space-y-4">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {days.map((day) => {
                      const isActive = activeMobileDate === day.date;

                      return (
                        <button
                          key={day.date}
                          type="button"
                          ref={isActive ? keepChipVisible : undefined}
                          aria-pressed={isActive}
                          onClick={() => setMobileDate(day.date)}
                          className={`flex-1 min-w-[68px] py-2.5 px-2 rounded-xl text-center border transition-all ${
                            isActive
                              ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-sm'
                              : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                          }`}
                        >
                          <span
                            className={`block text-[10px] font-bold uppercase ${
                              isActive ? 'text-white/80' : 'text-med-text-sub'
                            }`}
                          >
                            {day.short}
                          </span>
                          <span className="block text-base font-extrabold my-0.5">
                            {day.dateNumber}
                          </span>
                          <span
                            className={`block text-[10px] uppercase ${
                              isActive ? 'text-white/80' : 'text-med-text-muted'
                            }`}
                          >
                            {formatShortMonth(day.date)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-med-text-sub mb-2.5">
                      Horarios (Bloques de 30 min)
                    </span>

                    {mobileDay?.slots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {mobileDay.slots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={!slot.selectable}
                              title={SLOT_TITLE[slot.state]}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${slotClass(
                                { ...slot, isSelected },
                                true
                              )}`}
                            >
                              {slot.startTime}
                            </button>
                          );
                        })}
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
              </>
            )}
          </Card>

          {selectedSlot && (
            <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
              <div className="border-l-4 border-med-primary-900 pl-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
                  Resumen de Selección
                </span>
                <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
                  <span>📅</span>
                  <span>
                    {formatLongDate(selectedSlot.date)},{' '}
                    {selectedSlot.startTime} HS
                  </span>
                </p>
                <p className="text-xs text-med-text-sub mt-0.5">
                  {searchedDoctor.name} • {weekDayOf(selectedSlot.date).label} •
                  Duración: 30 min
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label
                    htmlFor="reason"
                    className="text-xs font-semibold text-med-text-sub"
                  >
                    Motivo de la consulta
                  </label>
                  <input
                    id="reason"
                    type="text"
                    maxLength={300}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ej: Control anual"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
                      reasonError ? 'border-red-400' : 'border-med-border'
                    }`}
                  />
                  {reasonError && (
                    <p className="text-xs text-red-500 font-medium">
                      {reasonError}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  disabled={!canConfirm}
                  onClick={handleConfirm}
                  className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl shadow-md text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {submitting ? 'Reservando...' : 'Confirmar Turno'}
                  </span>
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {confirmed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-med-primary-900">
              ¡Turno Confirmado con Éxito!
            </h3>
            <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
              Tu turno con{' '}
              <strong className="text-med-text-main">
                {confirmed.doctor.name}
              </strong>{' '}
              quedó reservado para el{' '}
              <strong className="text-med-text-main">
                {formatLongDate(confirmed.slot.date)} a las{' '}
                {confirmed.slot.startTime} hs
              </strong>
              .
            </p>

            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
              <p>
                <strong>Especialidad:</strong>{' '}
                {confirmed.doctor.specialty?.name}
              </p>
              <p>
                <strong>Paciente:</strong> {user?.name} (DNI: {user?.dni})
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="w-full text-xs py-2.5"
                onClick={() => navigate('/appointments')}
              >
                Ver Mis Turnos
              </Button>
              <Button
                variant="secondary"
                className="w-full text-xs py-2.5"
                onClick={() => setConfirmed(null)}
              >
                Reservar Otro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHome;
