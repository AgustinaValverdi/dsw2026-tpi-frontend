import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/Button';
import AuthLayout from '../../auth/components/AuthLayout';
import AuthField from '../../auth/components/AuthField';
import useAuth from '../../auth/hook/useAuth';
import { emailRules, passwordRules } from '../../auth/helpers/validations';

function PatientLoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const { signInPatient } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onValid = async (formData) => {
    setErrorMessage('');
    const { error } = await signInPatient(formData);

    if (error) setErrorMessage(error);
  };

  return (
    <AuthLayout
      title="Portal del Paciente"
      subtitle="Iniciá sesión para reservar y consultar tus turnos médicos."
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
          label="Correo Electrónico"
          icon="email"
          type="email"
          placeholder="paciente@medportal.com"
          autoComplete="username"
          error={errors.email?.message}
          {...register('email', emailRules)}
        />
        <AuthField
          label="Contraseña"
          icon="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', passwordRules)}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1 disabled:opacity-60"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar Paciente'}
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
          ¿No tenés cuenta?{' '}
          <Link
            to="/register"
            className="font-semibold text-med-primary-700 hover:underline"
          >
            Registrate
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default PatientLoginPage;
