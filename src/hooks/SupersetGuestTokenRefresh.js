import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUSES } from '../services/config/StatusConstants';
import { dispatchGetSupersetGuestToken } from '../state/charts/dispatchers';

const REFRESH_MARGIN_MS = 45 * 1000;
const RETRY_DELAY_MS = 15 * 1000;
const MAX_RETRY_DELAY_MS = 5 * 60 * 1000;

export const useSupersetGuestTokenRefresh = () => {
  const dispatch = useDispatch();
  const expiry = useSelector((s) => s.charts?.superset?.data?.expiry);
  const status = useSelector((s) => s.charts?.superset?.status);
  const timeoutRef = useRef(null);
  const retryCountRef = useRef(0);

  // Schedule proactive refresh before token expiry
  useEffect(() => {
    if (!expiry) return;

    retryCountRef.current = 0; // Reset retries on successful token fetch

    const expiresAt = new Date(expiry).getTime();
    const remainingMs = Math.max(expiresAt - Date.now(), 0);
    const refreshIn = Math.max(remainingMs - REFRESH_MARGIN_MS, 5_000);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      dispatch(dispatchGetSupersetGuestToken());
    }, refreshIn);

    return () => clearTimeout(timeoutRef.current);
  }, [expiry, dispatch]);

  // Retry with exponential backoff on token fetch failure
  useEffect(() => {
    if (status !== STATUSES.ERROR) return;

    const delay = Math.min(RETRY_DELAY_MS * Math.pow(2, retryCountRef.current), MAX_RETRY_DELAY_MS);
    console.warn(`Superset guest token fetch failed, retrying in ${Math.round(delay / 1000)}s...`);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      retryCountRef.current += 1;
      dispatch(dispatchGetSupersetGuestToken());
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [status, dispatch]);

  return null;
};
