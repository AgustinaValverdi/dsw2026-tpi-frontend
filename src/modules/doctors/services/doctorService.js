import { instance } from '../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { normalizeDoctor, toPage } from '../../shared/api/normalizers';

const nameFilter = (name) => {
  const value = name?.trim() ?? '';

  return value.length >= 3 ? value : undefined;
};

const fetchDoctors = async (url, { name, page = 1, pageSize = 10 } = {}) => {
  const { data } = await instance.get(url, {
    params: { name: nameFilter(name), pageIndex: page, pageSize },
  });

  return toPage(data, normalizeDoctor);
};

// Consultas normales: solamente médicos activos (reserva, dashboard, etc.).
export const getDoctors = (params) => fetchDoctors(ENDPOINTS.doctors, params);

// Directorio administrativo: incluye activos e inactivos.
export const getAdminDoctors = (params) =>
  fetchDoctors(ENDPOINTS.adminDoctors, params);

export const createDoctor = async ({ name, licenseNumber, specialtyId }) => {
  const { data } = await instance.post(ENDPOINTS.doctors, {
    name: name.trim(),
    licenseNumber: licenseNumber.trim(),
    specialtyId,
  });

  return normalizeDoctor(data);
};

export const deleteDoctor = async (id) => {
  await instance.delete(ENDPOINTS.doctor(id));
};
