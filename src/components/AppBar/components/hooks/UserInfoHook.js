// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useUserEmail, useUserProfilePic, useLogOut } from '../../../../state/auth/hooks';

export const useUserInfoHook = () => {
  const userProfilePic = useUserProfilePic();
  const userEmail = useUserEmail();
  const logOut = useLogOut();
  return { userProfilePic, userEmail, logOut };
};
