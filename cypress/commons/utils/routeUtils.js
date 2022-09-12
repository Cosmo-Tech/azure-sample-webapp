// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { apiUtils as api } from './apiUtils';

const browse = (url) => {
  const getScenariosAlias = api.interceptGetScenarios();
  cy.visit(url);
  cy.wait('@' + getScenariosAlias);
};

export const routeUtils = {
  browse,
};
