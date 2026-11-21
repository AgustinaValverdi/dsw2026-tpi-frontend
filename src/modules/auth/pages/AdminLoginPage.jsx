import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/components/Button';
import AuthLayout from '../components/AuthLayout';
import AuthField from '../components/AuthField';
import useAuth from '../hooks/useAuth';
import { emailRules, passwordRules } from '../helpers/validations';

function AdminLoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const { signInAdmin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onValid = async (formData) => {
    setErrorMessage('');
    const { error } = await signInAdmin(formData);

    if (error) setErrorMessage(error);
  };

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Por favor, autentíquese para acceder al portal de administración."
      footerLink={{ to: '/login', label: '← Volver al Portal de Pacientes' }}
      footer={
        <div className="bg-med-primary-50 border-t border-med-primary-100 p-4 sm:p-5 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-med-primary-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <p className="text-xs text-med-text-sub leading-relaxed">
            <strong className="text-med-text-main font-semibold">
              Solo Acceso Seguro:
            </strong>{' '}
            Este sistema es para personal autorizado. Los intentos de acceso no
            autorizados son registrados.
          </p>
        </div>
      }
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
          placeholder="admin@medportal.com"
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
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-60"
        >
          <span>{isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}</span>
          {!isSubmitting && <span className="text-sm">→</span>}
        </Button>

        {errorMessage && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 text-center"
          >
            {errorMessage}
          </div>
        )}
      </form>
    </AuthLayout>
  );
}

export default AdminLoginPage;
