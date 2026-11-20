export const ROLES = {
  ADMIN: 'ADMINISTRADOR',
  PATIENT: 'PACIENTE',
};

export const normalizeRole = (role) =>
  (role ?? '')
    .toString()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
    .trim();

export const homePathForRole = (role) =>
  normalizeRole(role) === ROLES.ADMIN ? '/admin/home' : '/';

export const redirectAfterLogin = (role, from) => {
  const isAdmin = normalizeRole(role) === ROLES.ADMIN;
  const fromIsAdminArea = Boolean(from?.startsWith('/admin'));

  if (from && isAdmin === fromIsAdminArea) return from;

  return homePathForRole(role);
};

export const loginPathForRole = (role) =>
  normalizeRole(role) === ROLES.ADMIN ? '/admin/login' : '/login';
