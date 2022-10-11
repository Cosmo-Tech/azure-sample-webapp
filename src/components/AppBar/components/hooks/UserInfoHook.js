// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useUserName, useUserProfilePic } from '../../../../state/hooks/AuthHooks';

export const useUserInfoHook = () => {
  const userName = useUserName();
  const userProfilePic = useUserProfilePic();
  return { userName, userProfilePic };
};
