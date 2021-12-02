// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-localstorage-commands';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { PAGE_NAME, URL_REGEX, URL_POWERBI } from '../../constants/generic/TestConstants';
import { Scenarios } from './Scenarios';

function getMicrosoftLoginButton() {
  return cy.get(GENERIC_SELECTORS.login.microsoftLoginButton);
}

function login() {
  login.reqIndex = login.reqIndex || 1;
  cy.clearLocalStorageSnapshot();
  cy.visit(PAGE_NAME.SCENARIO);

  // Stub PowerBi request
  cy.intercept('GET', URL_POWERBI, {
    statusCode: 200,
  });

  const reqName = `requestLoginGetScenario_${login.reqIndex}`;
  cy.intercept('GET', URL_REGEX.SCENARIO_PAGE_WITH_ID).as(reqName);
  ++login.reqIndex;
  Login.getMicrosoftLoginButton().click();
  cy.wait('@' + reqName);

  Scenarios.getScenarioParametersTab().should('be.visible');
  Scenarios.getScenarioView().should('be.visible');
  cy.saveLocalStorage();
}

function relogin() {
  Cypress.Cookies.preserveOnce('ai_session', 'ai_user');
  cy.restoreLocalStorage();
  cy.visit(PAGE_NAME.SCENARIO);
}

export const Login = {
  getMicrosoftLoginButton,
  login,
  relogin,
};
