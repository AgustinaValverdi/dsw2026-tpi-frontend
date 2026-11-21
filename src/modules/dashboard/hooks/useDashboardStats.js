import useAsyncData from '../../shared/hooks/useAsyncData';
import { toISODate } from '../../shared/helpers/dates';
import { getDoctors } from '../../doctors/services/doctorService';
import { getSpecialtiesPage } from '../../specialties/services/specialtyService';
import { getAppointmentsByDate } from '../../appointments/services/appointmentSearchService';

const EMPTY_STATS = { doctors: null, specialties: null, today: null };

const loadStats = async () => {
  const [doctorPage, specialtyPage, todayAppointments] = await Promise.all([
    getDoctors({ pageSize: 1 }),
    getSpecialtiesPage({ pageSize: 1 }),
    getAppointmentsByDate(toISODate(new Date())),
  ]);

  return {
    doctors: doctorPage.total,
    specialties: specialtyPage.total,
    today: todayAppointments.filter((appt) => appt.status === 'BOOKED').length,
  };
};

const useDashboardStats = () => {
  const { data, error } = useAsyncData(loadStats, EMPTY_STATS);

  return { stats: data, error };
};

export default useDashboardStats;
