// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { WORKSPACE_ID1 } from '../../commons/constants/generic/TestConstants';
import { Login as GenericLogin } from '../generic';

const DEFAULT_URL = '/' + WORKSPACE_ID1;

// Parameters:
//   - options: c.f. "options" parameter of "login" function, in ../generic/Login.js
function login(options) {
  return GenericLogin.login({
    url: DEFAULT_URL,
    workspaceId: WORKSPACE_ID1,
    ...options,
  });
}

export const Login = {
  login,
};
