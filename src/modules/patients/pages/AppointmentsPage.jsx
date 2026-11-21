
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import ErrorBanner from '../../shared/components/ErrorBanner';
import useDeleteAction from '../../shared/hooks/useDeleteAction';
import useAuth from '../../auth/hooks/useAuth';
import { formatLongDate, isPast } from '../../shared/helpers/dates';
import { cancelAppointment } from '../services/bookingService';
import usePatientAppointments from '../hooks/usePatientAppointments';
import AppointmentCard from '../components/AppointmentCard';

const cancelById = (appointment) => cancelAppointment(appointment.id);

function AppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { appointments, loading, error, reload } = usePatientAppointments(
    user?.dni
  );

  const cancellation = useDeleteAction(cancelById, {
    onDone: reload,
    failMessage: 'No se pudo cancelar el turno.',
  });

  // Turnos confirmados que todavía no pasaron
  const upcoming = appointments.filter(
    (appt) => appt.status === 'BOOKED' && !isPast(appt.date, appt.startTime)
  );

  // Cancelados, completados, ausentes y turnos anteriores
  const history = appointments
    .filter(
      (appt) =>
        appt.status !== 'BOOKED' || isPast(appt.date, appt.startTime)
    )
    .reverse();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Mis Turnos Médicos
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Consultá tus próximos turnos y el historial de citas médicas.
          </p>
        </div>

        <Button onClick={() => navigate('/')}>
          + Solicitar Nuevo Turno
        </Button>
      </div>

      <ErrorBanner>{error}</ErrorBanner>

      {loading && (
        <p className="py-10 text-center text-sm text-med-text-muted">
          Cargando turnos...
        </p>
      )}

      {!loading && !error && appointments.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-sm text-med-text-sub">
            Todavía no tenés turnos registrados.
          </p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Reservar un turno
          </Button>
        </Card>
      )}

      {!loading && !error && appointments.length > 0 && (
        <>
          {/* Próximos turnos */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-med-text-main">
              Próximos turnos ({upcoming.length})
            </h2>

            {upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {upcoming.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    onCancel={cancellation.request}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-sm text-med-text-sub">
                No tenés turnos próximos.
              </Card>
            )}
          </section>

          {/* Historial */}
          {history.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-med-text-main">
                Historial de turnos ({history.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {history.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    onCancel={cancellation.request}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {cancellation.target && (
        <ConfirmDialog
          title="¿Cancelar este turno?"
          confirmLabel="Sí, cancelar"
          busyLabel="Cancelando..."
          busy={cancellation.busy}
          error={cancellation.error}
          onConfirm={cancellation.confirm}
          onCancel={cancellation.cancel}
        >
          <p>
            {cancellation.target.doctorName}
            {cancellation.target.date &&
              ` — ${formatLongDate(cancellation.target.date)} a las ${cancellation.target.startTime} hs`}
            . El horario quedará disponible para otros pacientes.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}

export default AppointmentsPage;
