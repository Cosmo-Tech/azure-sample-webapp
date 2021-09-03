// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SELECTORS } from '../commons/IdConstants.js';
import {
  URL_REGEX
} from '../commons/TestConstants.js';

// For this moment, login is handle by clicking on Microsoft Login button
Cypress.Commands.add('login', () => {
  cy.intercept('GET', URL_REGEX.WITH_UNKNOWN_ID_SCENARIO_SUFFIX).as('requestUpdateCurrentScenario');

  cy.get(SELECTORS.login.microsoftLoginButton).click();

  // TODO : Remove timeout due to loading page
  cy.wait('@requestUpdateCurrentScenario', { timeout: 10_000 });

  cy.get(SELECTORS.scenario.parameters.tabs).should('be.visible');
  cy.get(SELECTORS.scenario.view).should('be.visible');
});
