import { instance } from '../../shared/api/axiosInstance';
import { ENDPOINTS } from '../../shared/api/endpoints';
import { normalizeSpecialty, toPage } from '../../shared/api/normalizers';

const nameFilter = (name) => {
  const value = name?.trim() ?? '';

  return value.length >= 3 ? value : undefined;
};

export const getSpecialtiesPage = async ({
  name,
  page = 1,
  pageSize = 10,
} = {}) => {
  const { data } = await instance.get(ENDPOINTS.specialties, {
    params: { name: nameFilter(name), pageIndex: page, pageSize },
  });

  return toPage(data, normalizeSpecialty);
};

export const getAllSpecialties = async () => {
  const { items } = await getSpecialtiesPage({ pageSize: 1000 });

  return items;
};

export const createSpecialty = async ({ name, description }) => {
  const { data } = await instance.post(ENDPOINTS.specialties, {
    name: name.trim(),
    description: description.trim(),
  });

  return normalizeSpecialty(data);
};

export const deleteSpecialty = async (id) => {
  await instance.delete(ENDPOINTS.specialty(id));
};
