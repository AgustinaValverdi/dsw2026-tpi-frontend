import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/Button';
import AuthLayout from '../../auth/components/AuthLayout';
import AuthField from '../../auth/components/AuthField';
import useAuth from '../../auth/hooks/useAuth';
import {
  dniRules,
  emailRules,
  nameRules,
  passwordRules,
} from '../../auth/helpers/validations';

function PatientRegisterPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const { signUpPatient } = useAuth();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      dni: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onValid = async ({ name, dni, email, password }) => {
    setErrorMessage('');
    const { error } = await signUpPatient({
      name: name.trim(),
      dni,
      email,
      password,
    });

    if (error) setErrorMessage(error);
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Registrate para reservar y gestionar tus turnos médicos."
      footerLink={{
        to: '/admin/login',
        label: '¿Es personal administrativo? Ingrese aquí →',
      }}
    >
      <form
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col gap-4"
        noValidate
      >
        <AuthField
          label="Nombre completo"
          icon="user"
          placeholder="Ej: Juan Pérez"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', nameRules)}
        />
        <AuthField
          label="DNI"
          icon="id"
          inputMode="numeric"
          placeholder="Sin puntos, ej: 40123456"
          error={errors.dni?.message}
          {...register('dni', dniRules)}
        />
        <AuthField
          label="Correo Electrónico"
          icon="email"
          type="email"
          placeholder="paciente@medportal.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', emailRules)}
        />
        <AuthField
          label="Contraseña"
          icon="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password', passwordRules)}
        />
        <AuthField
          label="Repetir contraseña"
          icon="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Repetí la contraseña',
            validate: (value) =>
              value === getValues('password') || 'Las contraseñas no coinciden',
          })}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1 disabled:opacity-60"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>

        {errorMessage && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 text-center"
          >
            {errorMessage}
          </div>
        )}

        <p className="text-xs text-center text-med-text-sub">
          ¿Ya tenés cuenta?{' '}
          <Link
            to="/login"
            className="font-semibold text-med-primary-700 hover:underline"
          >
            Iniciá sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default PatientRegisterPage;
