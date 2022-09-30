// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Login as GenericLogin } from '../generic';
import { BREWERY_WORKSPACE_ID } from '../../constants/brewery/TestConstants';

const DEFAULT_URL = '/' + BREWERY_WORKSPACE_ID;

// Parameters:
//   - options: c.f. "options" parameter of "login" function, in ../generic/Login.js
function login(options) {
  return GenericLogin.login({
    url: DEFAULT_URL,
    workspaceId: BREWERY_WORKSPACE_ID,
    ...options,
  });
}

// Parameters:
//   - options: c.f. "options" parameter of "login" function, in ../generic/Login.js
function relogin(options) {
  return GenericLogin.relogin({
    url: DEFAULT_URL,
    workspaceId: BREWERY_WORKSPACE_ID,
    ...options,
  });
}

export const Login = {
  login,
  relogin,
};
