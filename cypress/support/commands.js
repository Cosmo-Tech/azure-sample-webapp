// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SELECTORS } from '../commons/IdConstants';
import { URL_REGEX, URL_POWERBI } from '../commons/TestConstants';

// For this moment, login is handle by clicking on Microsoft Login button
Cypress.Commands.add('login', () => {
  // Stub PowerBi request
  cy.intercept('GET', URL_POWERBI, {
    statusCode: 200
  });

  cy.intercept('GET', URL_REGEX.SCENARIO_PAGE_WITH_ID).as('requestUpdateCurrentScenario');

  cy.get(SELECTORS.login.microsoftLoginButton).click();

  cy.wait('@requestUpdateCurrentScenario');

  cy.get(SELECTORS.scenario.parameters.tabs).should('be.visible');
  cy.get(SELECTORS.scenario.view).should('be.visible');
});

// Create scenario
Cypress.Commands.add('createScenario', (scenarioName, isMaster, datasetOrMasterName, scenarioType) => {
  cy.get(SELECTORS.scenario.createButton).click();
  cy.get(SELECTORS.scenario.createDialog.dialog).should('be.visible');

  cy.get(SELECTORS.scenario.createDialog.nameTextfield).type(scenarioName);

  if (isMaster === true) {
    cy.get(SELECTORS.scenario.createDialog.masterCheckbox).check();
    cy.get(SELECTORS.scenario.createDialog.datasetSelect).click();
  } else {
    cy.get(SELECTORS.scenario.createDialog.masterCheckbox).uncheck();
    cy.get(SELECTORS.scenario.createDialog.dialog).click().find(SELECTORS.scenario.selectInput).click();
  }
  cy.focused().type(datasetOrMasterName);
  cy.contains(datasetOrMasterName).should('be.visible').click();

  cy.get(SELECTORS.scenario.createDialog.typeSelect).click();
  cy.focused().type(scenarioType);
  /* eslint-disable cypress/no-force */
  cy.contains(scenarioType).should('be.visible').click({ force: true });

  cy.intercept('POST', URL_REGEX.SCENARIO_PAGE).as('requestCreateScenario');
  cy.intercept('GET', URL_REGEX.SCENARIO_PAGE).as('requestUpdateScenarioList');

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
Cypress.Commands.add('deleteScenario', (scenarioName) => {
  cy.get(SELECTORS.scenario.manager.search).clear().type(scenarioName);
  cy.get(SELECTORS.scenario.manager.button.delete).click();
  cy.get(SELECTORS.scenario.manager.confirmDeleteDialog).contains('button', 'Confirm').click();
});
