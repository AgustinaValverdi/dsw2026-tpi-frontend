import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import ErrorBanner from '../../shared/components/ErrorBanner';
import useAsyncData from '../../shared/hooks/useAsyncData';
import { getAllDoctors } from '../services/availabilityService';
import useDoctorSchedule from '../hooks/useDoctorSchedule';
import DoctorSelectCard from '../components/DoctorSelectCard';
import ScheduleRow from '../components/ScheduleRow';

const NO_DOCTORS = [];

function FeedbackMessage({ feedback }) {
  if (!feedback) return null;

  const isError = feedback.type === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`p-3 rounded-lg text-xs border ${
        isError
          ? 'bg-red-50 border-red-200 text-red-600'
          : 'bg-med-active-bg border-emerald-200 text-med-active-text'
      }`}
    >
      {feedback.message}
    </div>
  );
}

function AvailabilityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId') ?? '';
  const doctors = useAsyncData(getAllDoctors, NO_DOCTORS);
  const editor = useDoctorSchedule(doctorId);

  const selectDoctor = (id) => setSearchParams(id ? { doctorId: id } : {});

  const renderEditor = () => {
    if (!doctorId) {
      return (
        <p className="p-10 text-center text-sm text-med-text-muted">
          Seleccioná un profesional para configurar su disponibilidad.
        </p>
      );
    }

    if (editor.loading) {
      return (
        <p className="p-10 text-center text-sm text-med-text-muted">
          Cargando disponibilidad...
        </p>
      );
    }

    return (
      <>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[560px]">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-5 py-3">Día</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Entrada</th>
                <th className="px-5 py-3">Salida</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {editor.schedule.map((day, index) => (
                <ScheduleRow
                  key={day.key}
                  day={day}
                  error={editor.errors[index]}
                  onChange={editor.updateDay}
                  onCopy={editor.copyToActiveDays}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-med-border flex flex-col gap-3">
          <FeedbackMessage feedback={editor.feedback} />
          {editor.activeCount === 0 && (
            <p className="text-xs text-med-text-muted">
              Activá al menos un día para poder guardar.
            </p>
          )}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/doctors')}
            >
              Cancelar
            </Button>
            <Button
              disabled={!editor.canSave}
              onClick={editor.save}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editor.saving ? 'Guardando...' : 'Guardar Disponibilidad'}
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <nav className="text-xs text-med-text-muted mb-2">
          <Link to="/admin/doctors" className="hover:underline">
            Doctores
          </Link>{' '}
          ›{' '}
          <span className="font-semibold text-med-primary-900">
            Disponibilidad Horaria
          </span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Gestionar Disponibilidad Horaria
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Defina los días y rangos horarios de atención para el profesional
          seleccionado.
        </p>
      </div>

      <ErrorBanner>{doctors.error}</ErrorBanner>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col gap-4">
          <DoctorSelectCard
            doctors={doctors.data}
            doctorId={doctorId}
            onChange={selectDoctor}
          />

          <Card className="p-4 flex items-start gap-3">
            <span className="text-med-primary-600 font-bold">ⓘ</span>
            <p className="text-xs text-med-text-sub leading-relaxed">
              Se generan turnos de 30 minutos para el resto del mes en los días
              activos. Al actualizar, se sobrescribe la disponibilidad del mes;
              los turnos ya reservados no se modifican.
            </p>
          </Card>
        </div>

        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-5 border-b border-med-border flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-med-primary-900">
              Configuración de Horarios
            </h2>
            <span className="text-xs text-med-text-muted">
              ⏱ Intervalos automáticos de 30 minutos
            </span>
          </div>
          {renderEditor()}
        </Card>
      </div>
    </div>
  );
}

export default AvailabilityPage;
