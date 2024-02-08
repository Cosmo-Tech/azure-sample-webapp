// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useApplicationStatus } from '../../state/hooks/ApplicationHooks';
import { useAuthStatus } from '../../state/hooks/AuthHooks';

export const useUserStatusGateHook = () => {
  const authStatus = useAuthStatus();
  const applicationStatus = useApplicationStatus();
  return {
    authStatus,
    applicationStatus,
  };
};
