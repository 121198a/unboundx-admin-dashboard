import { useCallback, useEffect, useRef, useState } from 'react';
import { extractList, extractPagination } from './utils/apiShape';
import { DEFAULT_PAGE_SIZE, STORAGE_KEYS } from './constants';
import { ApiError } from './api/apiClient';
import defaultLogo from './assets/default-logo.png';

/**
 * =====================================================================
 * REUSABLE HOOKS — one file (was split across 5 files before)
 * =====================================================================
 */

/** Debounces a fast-changing value (e.g. search input) by `delay` ms. */
export function useDebouncedValue(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debounced;
}

/**
 * Generic data-fetching hook for any paginated, searchable list endpoint.
 * `fetcher` must be a function of shape ({ page, pageSize, search, signal }) => Promise.
 */
export function usePaginatedList(fetcher, { pageSize = DEFAULT_PAGE_SIZE, search = '' } = {}) {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevSearchRef = useRef(search);
  const requestIdRef = useRef(0);
  const controllerRef = useRef(null);

  const load = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const response = await fetcher({ page, pageSize, search, signal: controller.signal });
      if (requestId !== requestIdRef.current) return;
      setRows(extractList(response));
      setPagination(extractPagination(response, { page, pageSize }));
    } catch (err) {
      if (err instanceof ApiError && err.code === 'CANCELED') return; // superseded — a newer request is already handling this
      if (requestId !== requestIdRef.current) return;
      setError(err instanceof ApiError ? err : new ApiError({ message: err.message }));
      setRows([]);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    const searchChanged = prevSearchRef.current !== search;
    prevSearchRef.current = search;
    if (searchChanged && page !== 1) {
      setPage(1);
      return;
    }
    load();
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search]);

  return { rows, pagination, page, setPage, loading, error, reload: load };
}


export function useLoginLogo() {
  const [logoUrl, setLogoUrl] = useState(
    localStorage.getItem(STORAGE_KEYS.LOGIN_LOGO) || defaultLogo
  );
  const [hasCustomLogo, setHasCustomLogo] = useState(
    Boolean(localStorage.getItem(STORAGE_KEYS.LOGIN_LOGO))
  );

  const refresh = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.LOGIN_LOGO);
    setLogoUrl(stored || defaultLogo);
    setHasCustomLogo(Boolean(stored));
  }, []);

  useEffect(() => {
    refresh();

    const onLogoChanged = () => refresh();

    window.addEventListener('ux:logo-changed', onLogoChanged);
    window.addEventListener('storage', onLogoChanged);

    return () => {
      window.removeEventListener('ux:logo-changed', onLogoChanged);
      window.removeEventListener('storage', onLogoChanged);
    };
  }, [refresh]);

  return {
    logoUrl,
    hasCustomLogo,
    loading: false,
    refresh,
  };
}

export function notifyLogoChanged() {
  window.dispatchEvent(new Event('ux:logo-changed'));
}
