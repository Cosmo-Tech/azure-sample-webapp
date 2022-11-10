// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { apiUtils as api } from './apiUtils';
import { WEBAPP_URL_REGEX } from '../constants/generic/TestConstants';

const browse = (url) => {
  const newPageQueries = api.interceptNewPageQueries();
  const isScenarioIdInURL = WEBAPP_URL_REGEX.SCENARIO_PAGE_WITH_ID.test(url);
  if (isScenarioIdInURL) {
    const scenarioId = url.match(/s-\w*/);
    const getScenarioAlias = api.interceptGetScenario(scenarioId[0]);
    cy.visit(url);
    api.waitAlias(getScenarioAlias);
  } else {
    cy.visit(url);
  }
  api.waitAliases(newPageQueries, { timeout: 60 * 1000 });
};
export const routeUtils = {
  browse,
};
