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

function login(url = BASE_URL) {
  const reqAuthAlias = api.interceptAuthentication();
  const newPageQueries = api.interceptNewPageQueries();
  cy.clearLocalStorageSnapshot();
  cy.visit(url, {
    // next line defines English as default language for tests
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'languages', {
        value: ['en-US'],
      });
    },
  });
  Login.getMicrosoftLoginButton().click();
  api.waitAlias(reqAuthAlias);
  api.waitNewPageQueries(newPageQueries);
  Scenarios.getScenarioViewTab(60).should('be.visible');
  cy.saveLocalStorage();
}

function relogin(url = BASE_URL) {
  Cypress.Cookies.preserveOnce('ai_session', 'ai_user');
  cy.restoreLocalStorage();
  const newPageQueries = api.interceptNewPageQueries();

  cy.visit(url, {
    // next line defines English as default language for tests
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'languages', {
        value: ['en-US'],
      });
    },
  });
  api.waitNewPageQueries(newPageQueries);
  Scenarios.getScenarioViewTab(60).should('be.visible');
}

export const Login = {
  getMicrosoftLoginButton,
  login,
  relogin,
};
