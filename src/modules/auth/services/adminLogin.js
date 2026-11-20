import { instance } from '../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { ROLES } from '../helpers/roles';
import { buildSession } from '../helpers/session';

export const loginAdmin = async ({ email, password }) => {
  const { data } = await instance.post(ENDPOINTS.adminLogin, {
    email,
    password,
  });

  return buildSession(data, { email, role: ROLES.ADMIN });
};
