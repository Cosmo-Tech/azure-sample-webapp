// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-localstorage-commands';
import { PAGE_NAME, URL_REGEX, URL_POWERBI } from '../commons/constants/GENERIC_SELECTORS/TestConstants';
import { GENERIC_SELECTORS } from '../commons/constants/GENERIC_SELECTORS/IdConstants';
import { Scenarios } from '../../commons/actions';

// For this moment, login is handle by clicking on Microsoft Login button
// Function for the 1st login, that will save a snapshot of the local storage after logging in
// This function should be used in "before" statements
Cypress.Commands.add('login', () => {
  cy.clearLocalStorageSnapshot();
  cy.visit(PAGE_NAME.SCENARIO);

  // Stub PowerBi request
  cy.intercept('GET', URL_POWERBI, {
    statusCode: 200,
  });

  cy.intercept('GET', URL_REGEX.SCENARIO_PAGE_WITH_ID).as('requestUpdateCurrentScenario');
  Scenarios.getMicrosoftLoginButton().click();
  cy.wait('@requestUpdateCurrentScenario');

  cy.get(GENERIC_SELECTORS.scenario.parameters.tabs).should('be.visible');
  cy.get(GENERIC_SELECTORS.scenario.view).should('be.visible');
  cy.saveLocalStorage();
});

// Function to resume an existing session by keeping the existing cookies and loading the last local storage snapshot
// This function should be used in "beforeEach" statements
Cypress.Commands.add('relogin', () => {
  Cypress.Cookies.preserveOnce('ai_session', 'ai_user');
  cy.restoreLocalStorage();
  cy.visit(PAGE_NAME.SCENARIO);
});

// Create scenario
Cypress.Commands.add('createScenario', (scenarioName, isMaster, datasetOrMasterName, scenarioType) => {
  cy.get(GENERIC_SELECTORS.scenario.createButton).click();
  cy.get(GENERIC_SELECTORS.scenario.createDialog.dialog).should('be.visible');

  cy.get(GENERIC_SELECTORS.scenario.createDialog.nameTextfield).type(scenarioName);

  if (isMaster === true) {
    cy.get(GENERIC_SELECTORS.scenario.createDialog.masterCheckbox).check();
    cy.get(GENERIC_SELECTORS.scenario.createDialog.datasetSelect).click();
  } else {
    cy.get(GENERIC_SELECTORS.scenario.createDialog.masterCheckbox).uncheck();
    cy.get(GENERIC_SELECTORS.scenario.createDialog.dialog).click().find(GENERIC_SELECTORS.scenario.selectInput).click();
  }
  cy.focused().type(datasetOrMasterName);
  cy.contains(datasetOrMasterName).should('be.visible').click();

  cy.get(GENERIC_SELECTORS.scenario.createDialog.typeSelect).click();
  cy.focused().type(scenarioType);
  /* eslint-disable cypress/no-force */
  cy.contains(scenarioType).should('be.visible').click({ force: true });

  const scenarioCreationAlias = 'requestCreateScenario_' + scenarioName.replaceAll(' ', '');
  const scenarioListUpdateAlias = 'requestUpdateScenarioList_' + scenarioName.replaceAll(' ', '');
  cy.intercept('POST', URL_REGEX.SCENARIO_PAGE).as(scenarioCreationAlias);
  cy.intercept('GET', URL_REGEX.SCENARIO_PAGE).as(scenarioListUpdateAlias);

  cy.get(GENERIC_SELECTORS.scenario.createDialog.submitButton).click();

  let scenarioCreatedId, scenarioCreatedName;
  cy.wait('@' + scenarioCreationAlias).then((req) => {
    scenarioCreatedName = req.response.body.name;
    scenarioCreatedId = req.response.body.id;
    cy.wrap(scenarioCreatedId).as('scenarioCreatedId');
    cy.wrap(scenarioCreatedName).should('equal', scenarioName);
  });

  cy.wait('@' + scenarioListUpdateAlias).then((req) => {
    const nameGet = req.response.body.find((obj) => obj.id === scenarioCreatedId).name;
    cy.wrap(nameGet).should('equal', scenarioCreatedName);
  });

  cy.get(GENERIC_SELECTORS.scenario.selectInput)
    .find('input')
    .should('have.value', scenarioName)
    .then(() => {
      return {
        scenarioCreatedId,
        scenarioCreatedName,
      };
    });
});

// Delete scenario
Cypress.Commands.add('deleteScenario', (scenarioName) => {
  cy.get(GENERIC_SELECTORS.scenario.manager.search).clear().type(scenarioName);
  cy.get(GENERIC_SELECTORS.scenario.manager.button.delete).click();
  cy.get(GENERIC_SELECTORS.scenario.manager.confirmDeleteDialog).contains('button', 'Confirm').click();
});
