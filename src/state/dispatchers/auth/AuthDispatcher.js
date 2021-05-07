// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Redux Action (equivalent to dispatch function)
import { AUTH_ACTIONS_KEY } from '../../commons/AuthConstants';

export const dispatchLogIn = (authProvider) => ({
  type: AUTH_ACTIONS_KEY.REQUEST_LOG_IN,
  provider: authProvider
});

export const dispatchLogOut = () => ({
  type: AUTH_ACTIONS_KEY.REQUEST_LOG_OUT
});

export const dispatchSetData = (payload) => ({
  type: AUTH_ACTIONS_KEY.SET_AUTH_DATA,
  data: payload
});
