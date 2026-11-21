import { useState } from 'react';
import { getErrorMessage } from '../../auth/helpers/backendError';

const useDeleteAction = (remove, { onDone, failMessage } = {}) => {
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const request = (item) => {
    setError('');
    setTarget(item);
  };

  const cancel = () => setTarget(null);

  const confirm = async () => {
    setBusy(true);
    setError('');

    try {
      await remove(target);
      setTarget(null);
      onDone?.();
    } catch (err) {
      setError(getErrorMessage(err, failMessage));
    } finally {
      setBusy(false);
    }
  };

  return { target, busy, error, request, cancel, confirm };
};

export default useDeleteAction;
