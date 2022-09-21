// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { apiUtils as api } from './apiUtils';
import { WEBAPP_URL_REGEX } from '../constants/generic/TestConstants';

const browse = (url) => {
  const getScenariosAlias = api.interceptGetScenarios();
  cy.visit(url);
  cy.wait('@' + getScenariosAlias);
  if (WEBAPP_URL_REGEX.SCENARIO_PAGE_WITH_ID.test(url)) {
    const scenarioId = url.match(/s-\w*/);
    const getScenarioAlias = api.interceptGetScenario(scenarioId[0]);
    cy.wait('@' + getScenarioAlias);
  }
};
export const routeUtils = {
  browse,
};
