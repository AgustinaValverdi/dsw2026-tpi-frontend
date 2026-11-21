import { useCallback } from 'react';
import useAsyncData from '../../shared/hooks/useAsyncData';
import { getPatientAppointments } from '../services/bookingService';

const NO_APPOINTMENTS = [];

const byDateTime = (a, b) =>
  `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`);

const usePatientAppointments = (dni) => {
  const loader = useCallback(async () => {
    const list = await getPatientAppointments(dni);

    return [...list].sort(byDateTime);
  }, [dni]);

  const { data, loading, error, reload } = useAsyncData(
    loader,
    NO_APPOINTMENTS
  );

  return { appointments: data, loading, error, reload };
};

export default usePatientAppointments;