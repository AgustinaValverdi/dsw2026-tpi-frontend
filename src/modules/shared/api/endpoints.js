export const ENDPOINTS = {
  adminLogin: 'api/auth/admin/login',
  patientLogin: 'api/auth/patient/login',
  patientRegister: 'api/auth/patient/register',
  logout: 'api/auth/logout',

  specialties: 'api/specialties',
  doctors: 'api/doctors',
  doctorAvailabilities: (doctorId) => `api/doctors/${doctorId}/availabilities`,
  doctorSlots: (doctorId) => `api/doctors/${doctorId}/slots`,
  availabilities: 'api/availabilities',

  appointments: 'api/appointments',
  patientAppointments: 'api/appointments/patient',
  appointment: (id) => `api/appointments/${id}`,
};
