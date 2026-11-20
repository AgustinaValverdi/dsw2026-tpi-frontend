import { instance } from '../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { ROLES } from '../helpers/roles';
import { buildSession } from '../helpers/session';
import { loginPatient } from './patientLogin';

export const registerPatient = async ({ name, dni, email, password }) => {
  const { data } = await instance.post(ENDPOINTS.patientRegister, {
    name,
    dni: Number(dni),
    email,
    password,
  });

  if (data?.token) {
    return buildSession(data, {
      name,
      dni: Number(dni),
      email,
      role: ROLES.PATIENT,
    });
  }

  return loginPatient({ email, password });
};
