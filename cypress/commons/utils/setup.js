// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { apiUtils as api } from './apiUtils';
import { authUtils as auth } from './authUtils';

const setCypressKeystrokeDelay = (interval = 0) => {
  Cypress.Keyboard.defaults({
    keystrokeDelay: 0,
  });
};

const setupInterceptionMiddlewares = () => {
  api.startInterceptionMiddlewares();
};

// Parameters:
//   - options: dict with properties:
//     - noInterceptionMiddlewares (optional): if true, then middleware interception for authentication and workspace
//       won't be set
const initCypressAndStubbing = (options) => {
  auth.fetchServiceAccountTokenIfEnabled();
  setCypressKeystrokeDelay();
  if (!options?.noInterceptionMiddlewares) setupInterceptionMiddlewares();
};

export const setup = {
  initCypressAndStubbing,
  setCypressKeystrokeDelay,
  setupInterceptionMiddlewares,
};
