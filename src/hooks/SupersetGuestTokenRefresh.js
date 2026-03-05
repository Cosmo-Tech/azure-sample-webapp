// Token refresh and error retries are now handled entirely inside the
// getSupersetGuestTokenSaga (do...while polling loop).  This hook is
// kept only as a no-op so existing call-sites don't need to change.
export const useSupersetGuestTokenRefresh = () => null;
