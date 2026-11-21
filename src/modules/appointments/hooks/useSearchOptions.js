import useAsyncData from '../../shared/hooks/useAsyncData';
import { getAllSpecialties } from '../../specialties/services/specialtyService';
import { getDoctors } from '../../doctors/services/doctorService';

const EMPTY_OPTIONS = { specialties: [], doctors: [] };

const loadOptions = async () => {
  const [specialties, doctorPage] = await Promise.all([
    getAllSpecialties(),
    getDoctors({ pageSize: 1000 }),
  ]);

  return { specialties, doctors: doctorPage.items };
};

const useSearchOptions = () => {
  const { data, error } = useAsyncData(loadOptions, EMPTY_OPTIONS);

  return { ...data, error };
};

export default useSearchOptions;
