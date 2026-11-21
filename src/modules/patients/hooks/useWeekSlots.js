import { useCallback, useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../../auth/helpers/backendError';
import { addDays, startOfWeek, toISODate } from '../../shared/helpers/dates';
import { getDoctorSlots } from '../services/bookingService';
import { buildWeekDays } from '../helpers/slots';

const useWeekSlots = (doctor) => {
  const currentWeekStart = useMemo(() => startOfWeek(new Date()), []);
  const [weekStart, setWeekStart] = useState(currentWeekStart);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = toISODate(weekStart);
  const to = toISODate(addDays(weekStart, 6));

  const reload = useCallback(async () => {
    if (!doctor) return;

    setLoading(true);
    setError('');

    try {
      setSlots(await getDoctorSlots(doctor.id, from, to));
    } catch (err) {
      setSlots([]);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [doctor, from, to]);

  useEffect(() => {
    reload();
  }, [reload]);

  const days = useMemo(
    () => buildWeekDays(slots, weekStart),
    [slots, weekStart]
  );

  return {
    from,
    days,
    loading,
    error,
    reload,
    canGoBack: weekStart > currentWeekStart,
    changeWeek: (weeks) => setWeekStart((value) => addDays(value, weeks * 7)),
  };
};

export default useWeekSlots;
