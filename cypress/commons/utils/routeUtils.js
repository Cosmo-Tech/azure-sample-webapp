// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { apiUtils as api } from './apiUtils';
import { WEBAPP_URL_REGEX } from '../constants/generic/TestConstants';

const browse = (url, expectedURL = null) => {
  const newPageQueries = api.interceptNewPageQueries();
  const isScenarioIdInURL = WEBAPP_URL_REGEX.SCENARIO_ID_PATTERN.test(url);
  if (isScenarioIdInURL) {
    const scenarioId = url.match(/s-\w*/);
    const getScenarioAlias = api.interceptGetScenario(scenarioId[0]);
    cy.visit(url);
    api.waitAlias(getScenarioAlias);
  } else {
    cy.visit(url);
  }
  cy.url({ timeout: 5000 }).should('include', expectedURL ?? url);
  api.waitAliases(newPageQueries, { timeout: 60 * 1000 });
};

const goBackToScenario = (scenarioId, view = 'scenario') => {
  api.interceptGetScenario(scenarioId);
  cy.go('back');
  cy.url({ timeout: 3000 }).should('include', `/${view}/${scenarioId}`);
};

const goForwardToScenario = (scenarioId, view = 'scenario') => {
  api.interceptGetScenario(scenarioId);
  cy.go('forward');
  cy.url({ timeout: 3000 }).should('include', `/${view}/${scenarioId}`);
};

export const routeUtils = {
  browse,
  goBackToScenario,
  goForwardToScenario,
};
