import { instance } from '../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../shared/api/endpoints';
import {
  normalizeAppointment,
  normalizeDoctor,
  normalizeSlot,
  normalizeSpecialty,
  toList,
} from '../../shared/api/normalizers';

const ALL_PAGES = { pageSize: 100, pageIndex: 1 };

export const getSpecialties = async () => {
  const { data } = await instance.get(ENDPOINTS.specialties, {
    params: ALL_PAGES,
  });

  return toList(data).map(normalizeSpecialty);
};

export const getDoctorsBySpecialty = async (specialtyId) => {
  const { data } = await instance.get(ENDPOINTS.doctors, {
    params: { specialtyId, ...ALL_PAGES },
  });

  return toList(data)
    .map(normalizeDoctor)
    .filter((doc) => !doc.specialty.id || doc.specialty.id === specialtyId);
};

export const getDoctorSlots = async (doctorId, from, to) => {
  const { data } = await instance.get(ENDPOINTS.doctorSlots(doctorId), {
    params: { from, to },
  });

  return toList(data)
    .map(normalizeSlot)
    .filter((slot) => slot.date >= from && slot.date <= to);
};

export const createAppointment = async ({
  doctorId,
  availabilityId,
  dni,
  reason,
}) => {
  const { data } = await instance.post(ENDPOINTS.appointments, {
    doctorId,
    availabilityId,
    patient: { dni: Number(dni) },
    reason,
  });

  return data;
};

export const getPatientAppointments = async (dni) => {
  const { data } = await instance.get(ENDPOINTS.patientAppointments, {
    params: { dni },
  });

  return toList(data).map(normalizeAppointment);
};

export const cancelAppointment = async (id) => {
  await instance.delete(ENDPOINTS.appointment(id));
};
