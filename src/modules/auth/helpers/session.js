import { normalizeRole } from './roles';

const SESSION_KEY = 'session';

const ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const binary = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return false;

  const payload = decodeToken(token);

  if (!payload?.exp) return false;

  return payload.exp * 1000 <= Date.now();
};

export const buildSession = (response = {}, defaults = {}) => {
  const token = response.token;
  const claims = token ? decodeToken(token) : null;

  return {
    token,
    role: normalizeRole(
      response.role ?? claims?.role ?? claims?.[ROLE_CLAIM] ?? defaults.role
    ),
    name:
      response.name ??
      response.fullName ??
      claims?.[NAME_CLAIM] ??
      defaults.name ??
      '',
    dni: response.dni ?? defaults.dni ?? null,
    email: response.email ?? defaults.email ?? claims?.sub ?? '',
  };
};

export const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const loadSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));

    if (!session?.token || isTokenExpired(session.token)) {
      localStorage.removeItem(SESSION_KEY);

      return null;
    }

    return session;
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getToken = () => loadSession()?.token ?? null;
