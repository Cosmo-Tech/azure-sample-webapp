// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useAuthStatus } from '../../state/hooks/AuthHooks';
import { useApplicationStatus } from '../../state/hooks/ApplicationHooks';

export const useUserStatusGateHook = () => {
  const authStatus = useAuthStatus();
  const applicationStatus = useApplicationStatus();
  return {
    authStatus,
    applicationStatus,
  };
};
