import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import ErrorBanner from '../../shared/components/ErrorBanner';
import useAuth from '../../auth/hooks/useAuth';
import { getErrorMessage } from '../../auth/helpers/backendError';
import { createAppointment } from '../services/bookingService';
import { hasSelectableSlot } from '../helpers/slots';
import useDoctorPicker from '../hooks/useDoctorPicker';
import useWeekSlots from '../hooks/useWeekSlots';
import DoctorPicker from '../components/DoctorPicker';
import DoctorCard from '../components/DoctorCard';
import WeekHeader from '../components/WeekHeader';
import WeekSlotGrid from '../components/WeekSlotGrid';
import MobileSlotPicker from '../components/MobileSlotPicker';
import BookingSummary from '../components/BookingSummary';
import BookingSuccessModal from '../components/BookingSuccessModal';

function PatientHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const picker = useDoctorPicker();
  const [searchedDoctor, setSearchedDoctor] = useState(null);
  const week = useWeekSlots(searchedDoctor);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  const handleSearch = () => {
    setBookingError('');
    setSelectedSlot(null);
    setSearchedDoctor(picker.selectedDoctor);
  };

  const changeWeek = (weeks) => {
    setSelectedSlot(null);
    week.changeWeek(weeks);
  };

  const handleConfirm = async (reason) => {
    if (!user?.dni) {
      setBookingError(
        'Tu sesión no tiene DNI asociado. Cerrá sesión e ingresá nuevamente.'
      );

      return;
    }

    setSubmitting(true);
    setBookingError('');

    try {
      await createAppointment({
        doctorId: searchedDoctor.id,
        availabilityId: selectedSlot.id,
        dni: user.dni,
        reason,
      });

      setConfirmed({ doctor: searchedDoctor, slot: selectedSlot });
      setSelectedSlot(null);
    } catch (error) {
      setBookingError(getErrorMessage(error, 'No se pudo reservar el turno.'));

      if (error?.response?.status === 409) setSelectedSlot(null);
    } finally {
      setSubmitting(false);
      week.reload();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <DoctorPicker picker={picker} onSearch={handleSearch} />

      <ErrorBanner>{bookingError || week.error || picker.error}</ErrorBanner>

      {searchedDoctor && (
        <>
          <DoctorCard doctor={searchedDoctor} />

          <Card className="p-5 sm:p-6 border-med-border">
            <WeekHeader
              days={week.days}
              canGoBack={week.canGoBack}
              onChangeWeek={changeWeek}
            />

            {week.loading ? (
              <p className="py-10 text-center text-sm text-med-text-muted">
                Buscando turnos...
              </p>
            ) : (
              <>
                {!week.days.some(hasSelectableSlot) && (
                  <p className="pt-4 text-center text-xs text-med-text-muted">
                    Sin disponibilidad esta semana. Probá con la semana
                    siguiente.
                  </p>
                )}
                <WeekSlotGrid
                  days={week.days}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                />
                <MobileSlotPicker
                  key={`${searchedDoctor.id}-${week.from}`}
                  days={week.days}
                  selectedSlot={selectedSlot}
                  onSelect={setSelectedSlot}
                />
              </>
            )}
          </Card>

          {selectedSlot && (
            <BookingSummary
              key={selectedSlot.id}
              doctor={searchedDoctor}
              slot={selectedSlot}
              submitting={submitting}
              onConfirm={handleConfirm}
            />
          )}
        </>
      )}

      {confirmed && (
        <BookingSuccessModal
          booking={confirmed}
          user={user}
          onViewAppointments={() => navigate('/appointments')}
          onClose={() => setConfirmed(null)}
        />
      )}
    </div>
  );
}

export default PatientHome;
