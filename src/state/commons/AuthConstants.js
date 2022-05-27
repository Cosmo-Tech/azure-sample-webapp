// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Available authentication statuses
export const AUTH_STATUS = {
  ANONYMOUS: 'ANONYMOUS',
  AUTHENTICATED: 'AUTHENTICATED',
  CONNECTING: 'CONNECTING',
  DISCONNECTING: 'DISCONNECTING',
  DENIED: 'DENIED',
  UNKNOWN: 'UNKNOWN',
};

// Available authentication actions
export const AUTH_ACTIONS_KEY = {
  REQUEST_LOG_IN: 'REQUEST_LOG_IN',
  REQUEST_LOG_OUT: 'REQUEST_LOG_OUT',
  SET_AUTH_DATA: 'SET_AUTH_DATA',
};
