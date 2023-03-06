// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Login as GenericLogin } from '../generic';
import { BREWERY_WORKSPACE_ID } from '../../constants/brewery/TestConstants';

const DEFAULT_URL = '/' + BREWERY_WORKSPACE_ID;

// Parameters:
//   - options: dict with properties:
//     - url (optional): URL to navigate to after login
//     - workspaceId (optional): id of the workspace to open (required for interceptions when stubbing is enabled)
//     - scenarioId (optional): id of the scenario to open (required for interceptions when stubbing is enabled)
//     - onBrowseCallback (optional): callback function that will be called after setting the interceptions
//     - expectedURL (optional): can be set if expected URL after navigation is different from options.url (checked
//       with "include" assertion)
function login(options) {
  return GenericLogin.login({
    url: DEFAULT_URL,
    workspaceId: BREWERY_WORKSPACE_ID,
    ...options,
  });
}

// Parameters:
//   - options: dict with properties:
//     - url (optional): URL to navigate to after login
//     - workspaceId (optional): id of the workspace to open (required for interceptions when stubbing is enabled)
//     - scenarioId (optional): id of the scenario to open (required for interceptions when stubbing is enabled)
//     - onBrowseCallback (optional): callback function that will be called after setting the interceptions
//     - expectedURL (optional): can be set if expected URL after navigation is different from options.url (checked
//       with "include" assertion)
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
