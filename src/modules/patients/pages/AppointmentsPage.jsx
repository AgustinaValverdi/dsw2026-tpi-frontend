import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import useAuth from '../../auth/hook/useAuth';
import { getErrorMessage } from '../../auth/helpers/backendError';
import { formatLongDate, isPast } from '../../shared/helpers/dates';
import {
  cancelAppointment,
  getPatientAppointments,
} from '../services/bookingService';

const STATUS_STYLE = {
  BOOKED: {
    label: 'Confirmado',
    className: 'bg-med-active-bg text-med-active-text',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-med-danger-bg text-med-danger-text',
  },
  ATTENDED: { label: 'Atendido', className: 'bg-slate-100 text-slate-700' },
  NO_SHOW: {
    label: 'Ausente',
    className: 'bg-med-leave-bg text-med-leave-text',
  },
};

function AppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const list = await getPatientAppointments(user?.dni);

      setAppointments(
        list
          .filter((appt) => appt.status === 'BOOKED')
          .sort((a, b) =>
            `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
          )
      );
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'No se pudieron cargar tus turnos.')
      );
    } finally {
      setLoading(false);
    }
  }, [user?.dni]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleCancel = async () => {
    setCancelling(true);
    setErrorMessage('');

    try {
      await cancelAppointment(toCancel.id);
      setToCancel(null);
      await loadAppointments();
    } catch (error) {
      setToCancel(null);
      setErrorMessage(getErrorMessage(error, 'No se pudo cancelar el turno.'));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Mis Turnos Médicos
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Consultá y gestioná las citas médicas programadas.
          </p>
        </div>
        <Button onClick={() => navigate('/')}>+ Solicitar Nuevo Turno</Button>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
        >
          {errorMessage}
        </div>
      )}

      {loading && (
        <p className="py-10 text-center text-sm text-med-text-muted">
          Cargando turnos...
        </p>
      )}

      {!loading && !errorMessage && appointments.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-sm text-med-text-sub">No tenés turnos activos.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Reservar un turno
          </Button>
        </Card>
      )}

      {!loading && appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {appointments.map((appt) => {
            const status = STATUS_STYLE[appt.status] ?? STATUS_STYLE.BOOKED;
            const canCancel =
              appt.status === 'BOOKED' && !isPast(appt.date, appt.startTime);

            return (
              <Card
                key={appt.id}
                className="flex flex-col justify-between gap-4 p-6"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {appt.specialtyName ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                        {appt.specialtyName}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {status.label}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-med-primary-900">
                    {appt.doctorName}
                  </h3>
                  {appt.date && (
                    <p className="text-sm text-med-text-sub mt-2">
                      Fecha:{' '}
                      <strong className="text-med-text-main font-semibold">
                        {formatLongDate(appt.date)}
                      </strong>{' '}
                      a las{' '}
                      <strong className="text-med-text-main font-semibold">
                        {appt.startTime} hs
                      </strong>
                    </p>
                  )}
                  {appt.reason && (
                    <p className="text-xs text-med-text-muted mt-1">
                      Motivo: {appt.reason}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-3 border-t border-med-border">
                  <Button
                    variant="outline"
                    className="w-full text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canCancel}
                    onClick={() => setToCancel(appt)}
                  >
                    Cancelar Turno
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {toCancel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-lg font-bold text-med-primary-900">
              ¿Cancelar este turno?
            </h3>
            <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
              {toCancel.doctorName}
              {toCancel.date &&
                ` — ${formatLongDate(toCancel.date)} a las ${toCancel.startTime} hs`}
              . El horario quedará disponible para otros pacientes.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                variant="danger"
                className="w-full text-xs py-2.5 disabled:opacity-60"
                disabled={cancelling}
                onClick={handleCancel}
              >
                {cancelling ? 'Cancelando...' : 'Sí, cancelar'}
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs py-2.5"
                disabled={cancelling}
                onClick={() => setToCancel(null)}
              >
                Volver
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
