import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../auth/helpers/backendError';

const useAsyncData = (loader, initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setData(await loader());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
};

export default useAsyncData;
