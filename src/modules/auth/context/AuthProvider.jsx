import { createContext, useCallback, useMemo, useState } from 'react';
import { loginAdmin } from '../services/adminLogin';
import { loginPatient } from '../services/patientLogin';
import { registerPatient } from '../services/patientRegister';
import { logout } from '../services/logout';
import { clearSession, loadSession, saveSession } from '../helpers/session';
import { ROLES } from '../helpers/roles';
import { getErrorMessage } from '../helpers/backendError';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession());

  const startSession = useCallback((session) => {
    saveSession(session);
    setUser(session);
  }, []);

  const signOut = useCallback(() => {
    logout(loadSession()?.token);
    clearSession();
    setUser(null);
  }, []);

  const authenticate = useCallback(
    async (action, expectedRole, defaultMessage) => {
      try {
        const session = await action();

        if (session.role !== expectedRole) {
          return {
            error:
              expectedRole === ROLES.ADMIN
                ? 'Esta cuenta no tiene acceso administrativo.'
                : 'Esta cuenta no es de paciente. Ingresá por el portal administrativo.',
          };
        }

        startSession(session);

        return { error: null, session };
      } catch (error) {
        return { error: getErrorMessage(error, defaultMessage) };
      }
    },
    [startSession]
  );

  const signInAdmin = useCallback(
    (credentials) =>
      authenticate(
        () => loginAdmin(credentials),
        ROLES.ADMIN,
        'Credenciales administrativas inválidas.'
      ),
    [authenticate]
  );

  const signInPatient = useCallback(
    (credentials) =>
      authenticate(
        () => loginPatient(credentials),
        ROLES.PATIENT,
        'Credenciales inválidas.'
      ),
    [authenticate]
  );

  const signUpPatient = useCallback(
    (data) =>
      authenticate(
        () => registerPatient(data),
        ROLES.PATIENT,
        'No se pudo completar el registro.'
      ),
    [authenticate]
  );

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      signInAdmin,
      signInPatient,
      signUpPatient,
      signOut,
    }),
    [user, signInAdmin, signInPatient, signUpPatient, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
