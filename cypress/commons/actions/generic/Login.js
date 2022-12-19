// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-localstorage-commands';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { Scenarios } from './Scenarios';
import { apiUtils as api } from '../../utils';
import { stub } from '../../services/stubbing';
import { BREWERY_WORKSPACE_ID } from '../../constants/generic/TestConstants';

const BASE_URL = Cypress.config().baseUrl;
function getMicrosoftLoginButton() {
  return cy.get(GENERIC_SELECTORS.login.microsoftLoginButton);
}

function _handleWorkspaceSelector(url) {
  if (url == null) {
    url = BASE_URL;
    const defaultWorkspaceId = stub.isEnabledFor('GET_WORKSPACES')
      ? `/${stub.getDefaultWorkspaceId()}`
      : `/${BREWERY_WORKSPACE_ID}`;
    url += defaultWorkspaceId;
  }
  return url;
}

function _visit(url) {
  cy.visit(url, {
    // next line defines English as default language for tests
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'languages', {
        value: ['en-US'],
      });
    },
  });
}

function login(url) {
  url = _handleWorkspaceSelector(url);

  const reqAuthAlias = api.interceptAuthentication();
  const newPageQueries = api.interceptNewPageQueries();
  cy.clearLocalStorageSnapshot();

  _visit(url);

  getMicrosoftLoginButton().click();
  api.waitAlias(reqAuthAlias);
  api.waitAliases(newPageQueries, { timeout: 60 * 1000 });
  Scenarios.getScenarioViewTab(60).should('be.visible');
  cy.saveLocalStorage();
}

function loginWithoutWorkspace() {
  const reqAuthAlias = api.interceptAuthentication();
  api.interceptNewPageQueries();
  cy.clearLocalStorageSnapshot();

  _visit('/workspaces');

  getMicrosoftLoginButton().click();
  api.waitAlias(reqAuthAlias);
  cy.saveLocalStorage();
}

function relogin(url) {
  url = _handleWorkspaceSelector(url);
  Cypress.Cookies.preserveOnce('ai_session', 'ai_user');
  cy.restoreLocalStorage();
  const newPageQueries = api.interceptNewPageQueries();

  _visit(url);

  api.waitAliases(newPageQueries, { timeout: 60 * 1000 });
  Scenarios.getScenarioViewTab(60).should('be.visible');
}

export const Login = {
  getMicrosoftLoginButton,
  login,
  relogin,
  loginWithoutWorkspace,
};
