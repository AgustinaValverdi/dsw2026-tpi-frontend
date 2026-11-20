import { instance } from '../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../shared/api/endpoints';
import {
  normalizeAvailabilityRule,
  normalizeDoctor,
  toList,
} from '../../shared/api/normalizers';

export const getAllDoctors = async () => {
  const { data } = await instance.get(ENDPOINTS.doctors, {
    params: { pageSize: 100, pageIndex: 1 },
  });

  return toList(data).map(normalizeDoctor);
};

export const getDoctorAvailability = async (doctorId) => {
  const { data } = await instance.get(ENDPOINTS.doctorAvailabilities(doctorId));

  return toList(data)
    .map(normalizeAvailabilityRule)
    .filter((rule) => rule.day);
};

const withSeconds = (time) => (time.length === 5 ? `${time}:00` : time);

export const saveDoctorAvailability = async ({ doctorId, days, isUpdate }) => {
  const method = isUpdate ? 'put' : 'post';
  const { data } = await instance[method](ENDPOINTS.availabilities, {
    doctorId,
    days: days.map((day) => ({
      ...day,
      startTime: withSeconds(day.startTime),
      endTime: withSeconds(day.endTime),
    })),
  });

  return data;
};
