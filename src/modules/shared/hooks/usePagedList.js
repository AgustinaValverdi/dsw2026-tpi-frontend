import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../auth/helpers/backendError';

const EMPTY = { items: [], total: 0 };

const usePagedList = (fetchPage, { params = {}, pageSize = 10 } = {}) => {
  const paramsKey = JSON.stringify(params);
  const [page, setPage] = useState(1);
  const [lastParamsKey, setLastParamsKey] = useState(paramsKey);
  const [result, setResult] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  if (paramsKey !== lastParamsKey) {
    setLastParamsKey(paramsKey);
    setPage(1);
  }

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setResult(await fetchPage({ ...JSON.parse(paramsKey), page, pageSize }));
    } catch (err) {
      setResult(EMPTY);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [fetchPage, paramsKey, page, pageSize]);

  useEffect(() => {
    reload();
  }, [reload]);

  const afterRemove = useCallback(() => {
    if (result.items.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      reload();
    }
  }, [result.items.length, page, reload]);

  return {
    items: result.items,
    total: result.total,
    page,
    setPage,
    pageSize,
    totalPages: Math.max(1, Math.ceil(result.total / pageSize)),
    loading,
    error,
    reload,
    afterRemove,
  };
};

export default usePagedList;
