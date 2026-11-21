import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../auth/helpers/backendError';
import {
  getDoctorsBySpecialty,
  getSpecialties,
} from '../services/bookingService';

const useDoctorPicker = () => {
  const [specialties, setSpecialties] = useState([]);
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getSpecialties()
      .then((list) => {
        if (!active) return;

        setSpecialties(list);
        setSpecialtyId(list[0]?.id ?? '');
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!specialtyId) return undefined;

    let active = true;

    setDoctors([]);
    setDoctorId('');

    getDoctorsBySpecialty(specialtyId)
      .then((list) => {
        if (!active) return;

        setDoctors(list);
        setDoctorId(list[0]?.id ?? '');
      })
      .catch((err) => active && setError(getErrorMessage(err)));

    return () => {
      active = false;
    };
  }, [specialtyId]);

  return {
    specialties,
    specialtyId,
    setSpecialtyId,
    doctors,
    doctorId,
    setDoctorId,
    selectedDoctor: doctors.find((doc) => doc.id === doctorId) ?? null,
    loading,
    error,
  };
};

export default useDoctorPicker;
