import { instance } from '../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../shared/api/endpoints';

export const logout = async (token) => {
  if (!token) return;

  try {
    await instance.post(ENDPOINTS.logout, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return;
  }
};
