export const emailRules = {
  required: 'El correo electrónico es obligatorio',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    message: 'Ingresá un correo electrónico válido',
  },
};

export const passwordRules = {
  required: 'La contraseña es obligatoria',
  minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
};

export const dniRules = {
  required: 'El DNI es obligatorio',
  pattern: { value: /^\d{7,8}$/, message: 'El DNI debe tener 7 u 8 dígitos' },
};

export const nameRules = {
  required: 'El nombre es obligatorio',
  minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' },
  maxLength: { value: 150, message: 'Máximo 150 caracteres' },
};
