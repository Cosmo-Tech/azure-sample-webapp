// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-localstorage-commands';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { URL_REGEX, URL_POWERBI } from '../../constants/generic/TestConstants';
import { Scenarios, ScenarioParameters } from './..';

const BASE_URL = Cypress.config().baseUrl;
function getMicrosoftLoginButton() {
  return cy.get(GENERIC_SELECTORS.login.microsoftLoginButton);
}

function login() {
  login.reqIndex = login.reqIndex || 1;
  cy.clearLocalStorageSnapshot();
  cy.visit(BASE_URL, {
    // next line defines English as default language for tests
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'languages', {
        value: ['en-US'],
      });
    },
  });

  // Stub PowerBi request
  cy.intercept('GET', URL_POWERBI, {
    statusCode: 200,
  });

  const reqName = `requestLoginGetScenario_${login.reqIndex}`;
  cy.intercept('GET', URL_REGEX.SCENARIO_PAGE_WITH_ID).as(reqName);
  ++login.reqIndex;
  Login.getMicrosoftLoginButton().click();
  cy.wait('@' + reqName);

  Scenarios.getScenarioView().should('be.visible');
  ScenarioParameters.getParametersAccordionSummary().should('be.visible');
  cy.saveLocalStorage();
}

function relogin() {
  Cypress.Cookies.preserveOnce('ai_session', 'ai_user');
  cy.restoreLocalStorage();
  cy.visit(BASE_URL, {
    // next line defines English as default language for tests
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, 'languages', {
        value: ['en-US'],
      });
    },
  });
}

export const Login = {
  getMicrosoftLoginButton,
  login,
  relogin,
};
