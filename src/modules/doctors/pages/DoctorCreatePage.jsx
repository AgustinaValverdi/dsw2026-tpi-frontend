import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import FormField from '../../shared/components/FormField';
import { fieldClass } from '../../shared/helpers/formStyles';
import { getErrorMessage } from '../../auth/helpers/backendError';
import { getAllSpecialties } from '../../specialties/services/specialtyService';
import { createDoctor } from '../services/doctorService';

function DoctorCreatePage() {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', specialtyId: '', licenseNumber: '' },
  });

  useEffect(() => {
    let active = true;

    getAllSpecialties()
      .then((list) => active && setSpecialties(list))
      .catch((error) => active && setErrorMessage(getErrorMessage(error)))
      .finally(() => active && setLoadingSpecialties(false));

    return () => {
      active = false;
    };
  }, []);

  const onValid = async (values) => {
    setErrorMessage('');

    try {
      await createDoctor(values);
      navigate('/admin/doctors');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo guardar el médico.'));
    }
  };

  const noSpecialties = !loadingSpecialties && specialties.length === 0;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <nav className="text-xs text-med-text-muted">
        <Link to="/admin/doctors" className="hover:underline">
          Doctores
        </Link>{' '}
        ›{' '}
        <span className="font-semibold text-med-primary-900">
          Agregar Nuevo Doctor
        </span>
      </nav>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-med-border bg-med-primary-50/40">
          <h1 className="text-lg font-bold text-med-primary-900">
            Registrar Nuevo Doctor
          </h1>
          <p className="text-xs text-med-text-sub mt-1">
            Complete todos los campos obligatorios para integrar al nuevo
            facultativo al sistema del centro médico.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onValid)}
          noValidate
          className="p-5 sm:p-6 flex flex-col gap-5"
        >
          <FormField
            label="Nombre Completo del Doctor"
            htmlFor="name"
            error={errors.name?.message}
          >
            <input
              id="name"
              placeholder="Ej: Dr. Alejandro Martínez"
              className={fieldClass(errors.name)}
              {...register('name', {
                required: 'El nombre es obligatorio',
                validate: (value) =>
                  (value.trim().length >= 3 && value.trim().length <= 100) ||
                  'Debe tener entre 3 y 100 caracteres',
              })}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Especialidad"
              htmlFor="specialtyId"
              error={errors.specialtyId?.message}
            >
              <select
                id="specialtyId"
                disabled={loadingSpecialties || noSpecialties}
                className={fieldClass(errors.specialtyId)}
                {...register('specialtyId', {
                  required: 'Elegí una especialidad',
                })}
              >
                <option value="">
                  {loadingSpecialties
                    ? 'Cargando...'
                    : noSpecialties
                      ? 'No hay especialidades cargadas'
                      : 'Seleccione especialidad'}
                </option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Número de Licencia Médica"
              htmlFor="licenseNumber"
              error={errors.licenseNumber?.message}
            >
              <input
                id="licenseNumber"
                placeholder="Ej: MP-45920"
                className={fieldClass(errors.licenseNumber)}
                {...register('licenseNumber', {
                  required: 'La matrícula es obligatoria',
                  validate: (value) =>
                    (value.trim().length >= 3 && value.trim().length <= 20) ||
                    'Debe tener entre 3 y 20 caracteres',
                })}
              />
            </FormField>
          </div>

          {noSpecialties && (
            <p className="text-xs text-med-text-sub">
              Primero creá una especialidad en{' '}
              <Link
                to="/admin/specialties/new"
                className="font-semibold text-med-primary-700 hover:underline"
              >
                Nueva Especialidad
              </Link>
              .
            </p>
          )}

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
              onClick={() => navigate('/admin/doctors')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || noSpecialties}
              className="disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Doctor'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default DoctorCreatePage;
