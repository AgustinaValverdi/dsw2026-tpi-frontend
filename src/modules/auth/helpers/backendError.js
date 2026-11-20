const frontendErrorMessage = {
  AUTHENTICATION_FAILED: 'Usuario y/o contraseña incorrectos.',
  AUTHORIZATION_FAILED: 'No tenés permisos para realizar esta acción.',
  VALIDATION_ERROR: 'Revisá los datos ingresados.',
  REGISTER_USER_INVALID: 'Los datos de registro no son válidos.',
  REGISTER_USER_CONFLICT: 'Ya existe un usuario con ese email o DNI.',
  ENTITY_NOTFOUND: 'No se encontró el recurso solicitado.',
  APPOINTMENT_CONFLICT:
    'Ese turno acaba de ser reservado por otro paciente. Elegí otro horario.',
  APPOINTMENT_PAST_DATE: 'No se pueden reservar turnos en el pasado.',
  APPOINTMENT_DOCTOR_MISMATCH: 'El turno elegido no corresponde a ese médico.',
  APPOINTMENT_INVALID_REASON: 'El motivo debe tener al menos 5 caracteres.',
  APPOINTMENT_INVALID_DNI: 'El DNI no es válido.',
  APPOINTMENT_NOT_CANCELLABLE: 'Este turno ya no se puede cancelar.',
  PATIENT_LOGIN_INVALID: 'Revisá el email y los datos ingresados.',
  RATE_LIMIT_EXCEEDED:
    'Demasiados intentos. Esperá unos segundos y volvé a probar.',
  UNHANDLED_ERROR: 'Ocurrió un error inesperado. Intentá nuevamente.',
};

const statusMessage = {
  400: 'Revisá los datos ingresados.',
  401: 'Tu sesión no es válida. Iniciá sesión nuevamente.',
  403: 'No tenés permisos para realizar esta acción.',
  404: 'No se encontró el recurso solicitado.',
  409: 'La operación entra en conflicto con datos existentes.',
  429: 'Demasiados intentos. Esperá unos segundos y volvé a probar.',
  500: 'Ocurrió un error en el servidor. Intentá más tarde.',
};

export const getErrorMessage = (error, defaultMessage) => {
  const data = error?.response?.data ?? {};
  const code = data.errorCode ?? data.ErrorCode ?? data.code;

  if (code && frontendErrorMessage[code]) return frontendErrorMessage[code];

  const backendMessage = data.message ?? data.Message;

  if (backendMessage) return backendMessage;

  const status = error?.response?.status;
  const emptyBody =
    error?.response?.data === '' || error?.response?.data == null;
  const unreachable =
    !error?.response ||
    [502, 503, 504].includes(status) ||
    (status === 500 && emptyBody);

  if (unreachable) {
    return 'No se pudo conectar con el servidor.';
  }

  return (
    statusMessage[error.response.status] ?? defaultMessage ?? statusMessage[500]
  );
};

export { frontendErrorMessage };
