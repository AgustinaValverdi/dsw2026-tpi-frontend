import { useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../../auth/helpers/backendError';
import {
  getDoctorAvailability,
  saveDoctorAvailability,
} from '../services/availabilityService';
import {
  emptySchedule,
  scheduleFromRules,
  toActiveDays,
  validateDay,
} from '../helpers/schedule';

const SAVED_MESSAGE =
  'Disponibilidad guardada. Se generaron los turnos de 30 minutos para el resto del mes.';

const useDoctorSchedule = (doctorId) => {
  const [schedule, setSchedule] = useState(emptySchedule);
  const [hasExisting, setHasExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

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

  const errors = useMemo(() => schedule.map(validateDay), [schedule]);
  const activeCount = schedule.filter((day) => day.active).length;
  const canSave =
    Boolean(doctorId) && activeCount > 0 && errors.every((e) => !e) && !saving;

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

  const save = async () => {
    if (!canSave) return;

    setSaving(true);
    setFeedback(null);

    try {
      await saveDoctorAvailability({
        doctorId,
        isUpdate: hasExisting,
        days: toActiveDays(schedule),
      });

      setHasExisting(true);
      setFeedback({ type: 'success', message: SAVED_MESSAGE });
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

  return {
    schedule,
    errors,
    activeCount,
    canSave,
    loading,
    saving,
    feedback,
    updateDay,
    copyToActiveDays,
    save,
  };
};

export default useDoctorSchedule;
