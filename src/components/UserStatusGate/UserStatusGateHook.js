// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useApplicationStatus } from '../../state/app/hooks';
import { useAuthStatus } from '../../state/auth/hooks';

export const useUserStatusGateHook = () => {
  const authStatus = useAuthStatus();
  const applicationStatus = useApplicationStatus();
  return {
    authStatus,
    applicationStatus,
  };
};
