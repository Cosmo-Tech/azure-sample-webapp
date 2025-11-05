import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchGetSupersetGuestToken } from '../state/charts/dispatchers';

export const useSupersetGuestTokenRefresh = () => {
  const dispatch = useDispatch();
  const expiry = useSelector((s) => s.charts?.superset?.data?.expiry);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!expiry) return;

    const REFRESH_MARGIN_MS = 45 * 1000;
    const expiresAt = new Date(expiry).getTime();
    const remainingMs = Math.max(expiresAt - Date.now(), 0);
    const refreshIn = Math.max(remainingMs - REFRESH_MARGIN_MS, 5_000);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      dispatch(dispatchGetSupersetGuestToken());
    }, refreshIn);

    return () => clearTimeout(timeoutRef.current);
  }, [expiry, dispatch]);

  return null;
};
