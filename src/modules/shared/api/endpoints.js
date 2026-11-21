export const ENDPOINTS = {
  adminLogin: 'api/auth/admin/login',
  patientLogin: 'api/auth/patient/login',
  patientRegister: 'api/auth/patient/register',
  logout: 'api/auth/logout',

  specialties: 'api/specialties',
  specialty: (id) => `api/specialties/${id}`,
  doctors: 'api/doctors',
  adminDoctors: 'api/doctors/admin',
  doctor: (id) => `api/doctors/${id}`,
  appointmentsSearch: 'api/appointments/search',
  doctorAvailabilities: (doctorId) => `api/doctors/${doctorId}/availabilities`,
  doctorSlots: (doctorId) => `api/doctors/${doctorId}/slots`,
  availabilities: 'api/availabilities',

  appointments: 'api/appointments',
  patientAppointments: 'api/appointments/patient',
  appointment: (id) => `api/appointments/${id}`,
};
