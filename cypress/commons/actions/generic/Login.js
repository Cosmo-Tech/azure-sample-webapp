// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-localstorage-commands';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { Scenarios } from './Scenarios';
import { apiUtils as api } from '../../utils';

const BASE_URL = Cypress.config().baseUrl;
function getMicrosoftLoginButton() {
  return cy.get(GENERIC_SELECTORS.login.microsoftLoginButton);
}

function login() {
  const reqAuthAlias = api.interceptAuthentication();
  const reqPowerBIAlias = api.interceptPowerBIAzureFunction();
  const reqGetScenariosAlias = api.interceptGetScenarios();
  const reqGetDatasetsAlias = api.interceptGetDatasets();
  const reqGetWorkspaceAlias = api.interceptGetWorkspace();
  const reqGetSolutionAlias = api.interceptGetSolution();

  cy.clearLocalStorageSnapshot();
  cy.visit(BASE_URL, {
    // next line defines English as default language for tests
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'languages', {
        value: ['en-US'],
      });
    },
  });
  Login.getMicrosoftLoginButton().click();

  api.waitAlias(reqAuthAlias);
  api.waitAlias(reqGetScenariosAlias, { timeout: 60 * 1000 });
  api.waitAlias(reqGetDatasetsAlias, { timeout: 60 * 1000 });
  api.waitAlias(reqGetWorkspaceAlias, { timeout: 60 * 1000 });
  api.waitAlias(reqGetSolutionAlias, { timeout: 60 * 1000 });
  api.waitAlias(reqPowerBIAlias);
  Scenarios.getScenarioViewTab(60).should('be.visible');
  cy.saveLocalStorage();
}

function relogin() {
  Cypress.Cookies.preserveOnce('ai_session', 'ai_user');
  cy.restoreLocalStorage();

  const reqGetScenariosAlias = api.interceptGetScenarios();
  const reqGetDatasetsAlias = api.interceptGetDatasets();
  const reqGetWorkspaceAlias = api.interceptGetWorkspace();
  const reqGetSolutionAlias = api.interceptGetSolution();
  cy.visit(BASE_URL, {
    // next line defines English as default language for tests
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'languages', {
        value: ['en-US'],
      });
    },
  });
  api.waitAlias(reqGetScenariosAlias, { timeout: 60 * 1000 });
  api.waitAlias(reqGetDatasetsAlias, { timeout: 60 * 1000 });
  api.waitAlias(reqGetWorkspaceAlias, { timeout: 60 * 1000 });
  api.waitAlias(reqGetSolutionAlias, { timeout: 60 * 1000 });
  Scenarios.getScenarioViewTab(60).should('be.visible');
}

export const Login = {
  getMicrosoftLoginButton,
  login,
  relogin,
};
