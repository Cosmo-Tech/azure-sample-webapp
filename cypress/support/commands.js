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

// Create scenario
Cypress.Commands.add('createScenario', (scenarioName, isMaster, datasetOrMasterName, scenarioType) => {
  cy.get(SELECTORS.scenario.createButton).click();
  cy.get(SELECTORS.scenario.createDialog.dialog).should('be.visible');

  cy.get(SELECTORS.scenario.createDialog.nameTextfield).type(scenarioName);

  if (isMaster === true) {
    cy.get(SELECTORS.scenario.createDialog.masterCheckbox).click();
    cy.get(SELECTORS.scenario.createDialog.datasetSelect).click();
  } else {
    cy.get(SELECTORS.scenario.createDialog.dialog).click().find(SELECTORS.scenario.selectInput).click();
  }
  cy.focused().type(datasetOrMasterName);
  cy.contains(datasetOrMasterName).should('be.visible').click();

  cy.get(SELECTORS.scenario.createDialog.typeSelect).click();
  cy.focused().type(scenarioType);
  /* eslint-disable cypress/no-force */
  cy.contains(scenarioType).should('be.visible').click({ force: true });

  cy.intercept('POST', URL_REGEX.WITHOUT_SUFFIX).as('requestCreateScenario');
  cy.intercept('GET', URL_REGEX.WITHOUT_SUFFIX).as('requestUpdateScenarioList');

  cy.get(SELECTORS.scenario.createDialog.submitButton).click();

  let scenarioCreatedId, scenarioCreatedName;
  cy.wait('@requestCreateScenario').then((req) => {
    scenarioCreatedName = req.response.body.name;
    scenarioCreatedId = req.response.body.id;
    cy.wrap(scenarioCreatedId).as('scenarioCreatedId');
    cy.wrap(scenarioCreatedName).should('equal', scenarioName);
  });

  cy.wait('@requestUpdateScenarioList').then((req) => {
    const nameGet = req.response.body.find(obj => obj.id === scenarioCreatedId).name;
    cy.wrap(nameGet).should('equal', scenarioCreatedName);
  });

  cy.get(SELECTORS.scenario.selectInput).find('input').should('have.value', scenarioName).then(() => {
    return {
      scenarioCreatedId,
      scenarioCreatedName
    };
  });
});

// Delete scenario
Cypress.Commands.add('deleteScenario', (scenarioToDelete) => {
  const searchChildNode = (nodes) => {
    for (const node of nodes) {
      cy.get('[data-cy="' + node.name + '-node"]')
        .parent().parent().parent().parent().parent().parent()
        .find(SELECTORS.scenario.manager.button.expand).click();
    }
  };

  cy.get(SELECTORS.scenario.manager.tabName).click();

  if (scenarioToDelete.nodes !== undefined) {
    searchChildNode(scenarioToDelete.nodes);
  }

  cy.get('[data-cy="' + scenarioToDelete.name + '-node"]')
    .parent().find(SELECTORS.scenario.manager.button.delete).click();
  cy.get(SELECTORS.scenario.manager.confirmDeleteDialog).contains('button', 'Confirm').click();
});
