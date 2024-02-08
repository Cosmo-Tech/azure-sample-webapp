// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  useApplicationStatus,
  useIsDarkTheme,
  useGetAllInitialData,
  useSetApplicationStatus,
} from './state/hooks/ApplicationHooks';
import { useAuthStatus, useLogIn, useLogOut } from './state/hooks/AuthHooks';

export const useApp = () => {
  const applicationStatus = useApplicationStatus();
  const isDarkTheme = useIsDarkTheme();

  const authStatus = useAuthStatus();

  const getAllInitialData = useGetAllInitialData();
  const setApplicationStatus = useSetApplicationStatus();

  const logIn = useLogIn();
  const logOut = useLogOut();

  return [applicationStatus, authStatus, isDarkTheme, getAllInitialData, setApplicationStatus, logIn, logOut];
};
