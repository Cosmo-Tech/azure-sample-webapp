// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SELECTORS } from '../constants/IdConstants';
import {
  PAGE_NAME,
  URL_ROOT
} from '../constants/TestConstants.js';

const urlRegexWithAnySuffix = new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/.*`);

// For this moment, login is handle by clicking on Microsoft Login button
Cypress.Commands.add('login', () => {
  cy.intercept('GET', urlRegexWithAnySuffix).as('requestUpdateCurrentScenario1');

  cy.get(SELECTORS.login.microsoftLoginButton).click();

  // TODO : Remove timeout due to loading page
  cy.wait('@requestUpdateCurrentScenario1', { timeout: 10_000 });

  cy.get(SELECTORS.scenario.parameters.tabs).should('be.visible');
  cy.get(SELECTORS.scenario.view).should('be.visible');
});
