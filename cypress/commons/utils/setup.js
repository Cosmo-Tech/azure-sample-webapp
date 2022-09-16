// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { apiUtils as api } from './apiUtils';

const setCypressKeystrokeDelay = (interval = 0) => {
  Cypress.Keyboard.defaults({
    keystrokeDelay: 0,
  });
};

const setupInterceptionMiddlewares = () => {
  api.startInterceptionMiddlewares();
};

const initCypressAndStubbing = () => {
  setCypressKeystrokeDelay();
  setupInterceptionMiddlewares();
};

export const setup = {
  initCypressAndStubbing,
  setCypressKeystrokeDelay,
  setupInterceptionMiddlewares,
};
