import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import { fieldClass } from '../../shared/helpers/formStyles';
import { getErrorMessage } from '../../auth/helpers/backendError';
import { createSpecialty } from '../services/specialtyService';

const lengthRule = (min, max) => (value) =>
  (value.trim().length >= min && value.trim().length <= max) ||
  `Debe tener entre ${min} y ${max} caracteres`;

function SpecialtyCreatePage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '', description: '' } });

  const onValid = async (values) => {
    setErrorMessage('');

    try {
      await createSpecialty(values);
      navigate('/admin/specialties');
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'No se pudo guardar la especialidad.')
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <nav className="text-xs text-med-text-muted mb-2">
          <Link to="/admin/specialties" className="hover:underline">
            Especialidades
          </Link>{' '}
          ›{' '}
          <span className="font-semibold text-med-primary-900">
            Agregar Nueva Especialidad
          </span>
        </nav>
        <h1 className="text-lg font-bold text-med-primary-900">
          Registrar Nueva Especialidad
        </h1>
        <p className="text-xs text-med-text-sub mt-1">
          Complete la información para dar de alta una especialidad médica en el
          sistema.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <form
          onSubmit={handleSubmit(onValid)}
          noValidate
          className="flex flex-col gap-5"
        >
          <FormField
            label="Nombre de la Especialidad"
            htmlFor="name"
            error={errors.name?.message}
          >
            <input
              id="name"
              placeholder="Ej. Cardiología Intervencionista"
              className={fieldClass(errors.name)}
              {...register('name', {
                required: 'El nombre es obligatorio',
                validate: lengthRule(3, 100),
              })}
            />
          </FormField>

          <FormField
            label="Descripción"
            htmlFor="description"
            error={errors.description?.message}
          >
            <textarea
              id="description"
              rows={4}
              maxLength={100}
              placeholder="Detalle el alcance de la especialidad (10 a 100 caracteres)"
              className={`${fieldClass(errors.description)} resize-none`}
              {...register('description', {
                required: 'La descripción es obligatoria',
                validate: lengthRule(10, 100),
              })}
            />
          </FormField>

          {errorMessage && (
            <div
              role="alert"
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600"
            >
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-med-border">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/specialties')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Especialidad'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SpecialtyCreatePage;
