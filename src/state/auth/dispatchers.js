// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Redux Action (equivalent to dispatch function)
import { AUTH_ACTIONS_KEY } from './constants';

export const dispatchLogIn = (authProvider) => ({
  type: AUTH_ACTIONS_KEY.REQUEST_LOG_IN,
  provider: authProvider,
});

export const dispatchLogOut = (data) => ({
  type: AUTH_ACTIONS_KEY.REQUEST_LOG_OUT,
  data,
});
