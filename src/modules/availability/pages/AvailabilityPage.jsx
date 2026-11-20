import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { getErrorMessage } from '../../auth/helpers/backendError';
import { WEEK_DAYS, timeToMinutes } from '../../shared/helpers/dates';
import {
  getAllDoctors,
  getDoctorAvailability,
  saveDoctorAvailability,
} from '../services/availabilityService';

const DEFAULT_START = '08:00';
const DEFAULT_END = '12:00';

const emptySchedule = () =>
  WEEK_DAYS.map((day) => ({
    ...day,
    active: false,
    startTime: DEFAULT_START,
    endTime: DEFAULT_END,
  }));

const scheduleFromRules = (rules) =>
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

const validateDay = (day) => {
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

const timeInputClass = (hasError) =>
  `w-full px-2.5 py-2 text-xs bg-white border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600 disabled:bg-gray-50 disabled:text-med-text-muted ${
    hasError ? 'border-red-400' : 'border-med-border'
  }`;

function AvailabilityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId') ?? '';

  const [doctors, setDoctors] = useState([]);
  const [schedule, setSchedule] = useState(emptySchedule);
  const [hasExisting, setHasExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const doctor = doctors.find((doc) => doc.id === doctorId);
  const errors = useMemo(() => schedule.map(validateDay), [schedule]);
  const activeCount = schedule.filter((day) => day.active).length;
  const canSave =
    doctorId && activeCount > 0 && errors.every((error) => !error) && !saving;

  useEffect(() => {
    let active = true;

    getAllDoctors()
      .then((list) => active && setDoctors(list))
      .catch(
        (error) =>
          active &&
          setFeedback({ type: 'error', message: getErrorMessage(error) })
      );

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!doctorId) return undefined;

    let active = true;

    setLoading(true);
    setFeedback(null);

    getDoctorAvailability(doctorId)
      .then((rules) => {
        if (!active) return;

        setSchedule(scheduleFromRules(rules));
        setHasExisting(rules.length > 0);
      })
      .catch((error) => {
        if (!active) return;

        setSchedule(emptySchedule());
        setHasExisting(false);
        setFeedback({ type: 'error', message: getErrorMessage(error) });
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [doctorId]);

  const updateDay = (key, changes) => {
    setFeedback(null);
    setSchedule((days) =>
      days.map((day) => (day.key === key ? { ...day, ...changes } : day))
    );
  };

  const copyToActiveDays = (source) => {
    setSchedule((days) =>
      days.map((day) =>
        day.active
          ? { ...day, startTime: source.startTime, endTime: source.endTime }
          : day
      )
    );
  };

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    setFeedback(null);

    try {
      await saveDoctorAvailability({
        doctorId,
        isUpdate: hasExisting,
        days: schedule
          .filter((day) => day.active)
          .map(({ key, startTime, endTime }) => ({
            day: key,
            startTime,
            endTime,
          })),
      });

      setHasExisting(true);
      setFeedback({
        type: 'success',
        message:
          'Disponibilidad guardada. Se generaron los turnos de 30 minutos para el resto del mes.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(
          error,
          'No se pudo guardar la disponibilidad.'
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <nav className="text-xs text-med-text-muted mb-2">
          <Link to="/admin/doctors" className="hover:underline">
            Doctores
          </Link>{' '}
          ›{' '}
          <span className="font-semibold text-med-primary-900">
            Disponibilidad Horaria
          </span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Gestionar Disponibilidad Horaria
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Defina los días y rangos horarios de atención para el profesional
          seleccionado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col gap-4">
          <Card className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="doctor"
                className="text-xs font-semibold text-med-text-sub"
              >
                Seleccionar Profesional
              </label>
              <select
                id="doctor"
                value={doctorId}
                onChange={(e) =>
                  setSearchParams(
                    e.target.value ? { doctorId: e.target.value } : {}
                  )
                }
                className="w-full px-3 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
              >
                <option value="">Elegí un médico...</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                    {doc.specialty?.name ? ` - ${doc.specialty.name}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {doctor && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-med-primary-50 border border-med-primary-100">
                <div className="w-11 h-11 rounded-xl bg-med-primary-100 flex items-center justify-center text-xl">
                  🩺
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-med-primary-900 truncate">
                    {doctor.name}
                  </p>
                  <p className="text-xs text-med-text-sub truncate">
                    {doctor.specialty?.name}
                    {doctor.licenseNumber ? ` • ${doctor.licenseNumber}` : ''}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4 flex items-start gap-3">
            <span className="text-med-primary-600 font-bold">ⓘ</span>
            <p className="text-xs text-med-text-sub leading-relaxed">
              Se generan turnos de 30 minutos para el resto del mes en los días
              activos. Al actualizar, se sobrescribe la disponibilidad del mes;
              los turnos ya reservados no se modifican.
            </p>
          </Card>
        </div>

        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-5 border-b border-med-border flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-med-primary-900">
              Configuración de Horarios
            </h2>
            <span className="text-xs text-med-text-muted">
              ⏱ Intervalos automáticos de 30 minutos
            </span>
          </div>

          {!doctorId ? (
            <p className="p-10 text-center text-sm text-med-text-muted">
              Seleccioná un profesional para configurar su disponibilidad.
            </p>
          ) : loading ? (
            <p className="p-10 text-center text-sm text-med-text-muted">
              Cargando disponibilidad...
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[560px]">
                  <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
                    <tr>
                      <th className="px-5 py-3">Día</th>
                      <th className="px-5 py-3">Estado</th>
                      <th className="px-5 py-3">Entrada</th>
                      <th className="px-5 py-3">Salida</th>
                      <th className="px-5 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-med-border-subtle">
                    {schedule.map((day, index) => (
                      <tr key={day.key} className="align-top">
                        <td
                          className={`px-5 py-3.5 font-medium ${
                            day.active
                              ? 'text-med-text-main'
                              : 'text-med-text-muted'
                          }`}
                        >
                          {day.label}
                        </td>
                        <td className="px-5 py-3.5">
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={day.active}
                              onChange={(e) =>
                                updateDay(day.key, { active: e.target.checked })
                              }
                            />
                            <span className="relative w-9 h-5 rounded-full bg-gray-300 peer-checked:bg-med-primary-700 transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-med-primary-600" />
                            <span className="text-xs text-med-text-sub">
                              {day.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </label>
                        </td>
                        <td className="px-5 py-3.5">
                          <input
                            type="time"
                            step="1800"
                            aria-label={`Entrada ${day.label}`}
                            value={day.startTime}
                            disabled={!day.active}
                            onChange={(e) =>
                              updateDay(day.key, { startTime: e.target.value })
                            }
                            className={timeInputClass(Boolean(errors[index]))}
                          />
                        </td>
                        <td className="px-5 py-3.5">
                          <input
                            type="time"
                            step="1800"
                            aria-label={`Salida ${day.label}`}
                            value={day.endTime}
                            disabled={!day.active}
                            onChange={(e) =>
                              updateDay(day.key, { endTime: e.target.value })
                            }
                            className={timeInputClass(Boolean(errors[index]))}
                          />
                          {errors[index] && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">
                              {errors[index]}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            disabled={!day.active || Boolean(errors[index])}
                            onClick={() => copyToActiveDays(day)}
                            title="Copiar este horario a todos los días activos"
                            className="p-1.5 rounded-lg text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
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
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-5 border-t border-med-border flex flex-col gap-3">
                {feedback && (
                  <div
                    role={feedback.type === 'error' ? 'alert' : 'status'}
                    className={`p-3 rounded-lg text-xs border ${
                      feedback.type === 'error'
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-med-active-bg border-emerald-200 text-med-active-text'
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}
                {activeCount === 0 && (
                  <p className="text-xs text-med-text-muted">
                    Activá al menos un día para poder guardar.
                  </p>
                )}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin/doctors')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    disabled={!canSave}
                    onClick={handleSave}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Guardando...' : 'Guardar Disponibilidad'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AvailabilityPage;
