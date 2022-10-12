// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useUserEmail, useUserProfilePic } from '../../../../state/hooks/AuthHooks';

export const useUserInfoHook = () => {
  const userProfilePic = useUserProfilePic();
  const userEmail = useUserEmail();
  return { userProfilePic, userEmail };
};
