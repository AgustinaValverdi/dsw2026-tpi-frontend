import { instance } from '../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../shared/api/endpoints';
import {
  normalizeAppointment,
  toList,
  toPage,
} from '../../shared/api/normalizers';

export const searchAppointments = async ({
  specialtyId,
  doctorId,
  dni,
  date,
  page = 1,
  pageSize = 10,
} = {}) => {
  const { data } = await instance.get(ENDPOINTS.appointmentsSearch, {
    params: {
      specialtyId: specialtyId || undefined,
      doctorId: doctorId || undefined,
      dni: dni || undefined,
      date: date || undefined,
      pageIndex: page,
      pageSize,
    },
  });

  const result = toPage(data, normalizeAppointment);

  return {
    ...result,
    items: [...result.items].sort((a, b) =>
      `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
    ),
  };
};

export const getAppointmentsByDate = async (date) => {
  const { data } = await instance.get(ENDPOINTS.appointments, {
    params: { date },
  });

  return toList(data).map(normalizeAppointment);
};
