import { useState } from 'react';
import Button from '../../shared/components/Button';
import { formatShortDate } from '../../shared/helpers/dates';

import { EMPTY_FILTERS } from '../helpers/filters';

const inputClass =
  'w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600';

const labelClass = 'text-xs font-semibold text-med-text-sub';

function AppointmentFilters({ applied, specialties, doctors, onApply }) {
  const [form, setForm] = useState(EMPTY_FILTERS);
  const [dniError, setDniError] = useState('');

  const doctorOptions = form.specialtyId
    ? doctors.filter((doc) => doc.specialty?.id === form.specialtyId)
    : doctors;

  const update = (field) => (e) => {
    const value = e.target.value;

    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'specialtyId' ? { doctorId: '' } : {}),
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    const dni = form.dni.trim();

    if (dni && !/^\d{7,8}$/.test(dni)) {
      setDniError('El DNI debe tener 7 u 8 dígitos, sin puntos');

      return;
    }

    setDniError('');
    onApply({ ...form, dni });
  };

  const clear = () => {
    setForm(EMPTY_FILTERS);
    setDniError('');
    onApply(EMPTY_FILTERS);
  };

  const specialtyName = specialties.find(
    (s) => s.id === applied.specialtyId
  )?.name;
  const doctorName = doctors.find((d) => d.id === applied.doctorId)?.name;

  const chips = [
    applied.dni && `DNI: ${applied.dni}`,
    applied.specialtyId && `Especialidad: ${specialtyName ?? ''}`,
    applied.doctorId && `Doctor: ${doctorName ?? ''}`,
    applied.date && `Fecha: ${formatShortDate(applied.date)}`,
  ].filter(Boolean);

  return (
    <>
      <form
        onSubmit={submit}
        noValidate
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 items-end"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dni" className={labelClass}>
            DNI del Paciente
          </label>
          <input
            id="dni"
            inputMode="numeric"
            placeholder="Ej: 40123456"
            value={form.dni}
            onChange={update('dni')}
            className={`${inputClass} ${dniError ? 'border-red-400' : ''}`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="specialty" className={labelClass}>
            Especialidad
          </label>
          <select
            id="specialty"
            value={form.specialtyId}
            onChange={update('specialtyId')}
            className={inputClass}
          >
            <option value="">Todas las Especialidades</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="doctor" className={labelClass}>
            Doctor
          </label>
          <select
            id="doctor"
            value={form.doctorId}
            onChange={update('doctorId')}
            className={inputClass}
          >
            <option value="">Todos los Doctores</option>
            {doctorOptions.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className={labelClass}>
            Fecha
          </label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={update('date')}
            className={inputClass}
          />
        </div>

        <Button type="submit" className="w-full py-2">
          Aplicar Filtros
        </Button>
      </form>

      {dniError && (
        <p className="text-xs text-red-500 font-medium mt-2">{dniError}</p>
      )}

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
          {chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800"
            >
              {chip}
            </span>
          ))}
          <button
            type="button"
            onClick={clear}
            className="text-xs font-semibold text-med-primary-700 hover:underline ml-1"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </>
  );
}

export default AppointmentFilters;
