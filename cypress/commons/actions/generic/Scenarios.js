// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { PAGE_NAME, URL_ROOT } from '../../TestConstants';
import { SELECTORS } from '../../IdConstants';

// Get elements in scenario view
function getScenarioSelector () {
  return cy.get(SELECTORS.scenario.selectInput);
}
function getScenarioCreationButton () {
  return cy.get(SELECTORS.scenario.createButton);
}
function getScenarioCreationDialog () {
  return cy.get(SELECTORS.scenario.createDialog.dialog);
}
function getScenarioCreationDialogNameField () {
  return cy.get(SELECTORS.scenario.createDialog.nameTextfield);
}
function getScenarioCreationDialogMasterCheckbox () {
  return cy.get(SELECTORS.scenario.createDialog.masterCheckbox);
}
function getScenarioCreationDialogDatasetSelector () {
  return cy.get(SELECTORS.scenario.createDialog.datasetSelect);
}
function getScenarioCreationDialogParentScenarioSelector () {
  return getScenarioCreationDialog().find(SELECTORS.scenario.selectInput);
}
function getScenarioCreationDialogRunTypeSelector () {
  return cy.get(SELECTORS.scenario.createDialog.typeSelect);
}
function getScenarioCreationDialogSubmitButton () {
  return cy.get(SELECTORS.scenario.createDialog.submitButton);
}

// From scenario view, select the scenario with the provided name and id
function select (scenarioName, scenarioId) {
  const reqName = `requestSelectScenario_${scenarioName}`.replaceAll(' ', '');
  const scenarioUrlRegex = new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/${scenarioId}`);
  cy.intercept('GET', scenarioUrlRegex).as(reqName);
  getScenarioSelector().click().clear().type(scenarioName + '{downarrow}{enter}');
  cy.wait(`@${reqName}`).its('response').its('body').its('name').should('equal', scenarioName);
}

export const Scenarios = {
  getScenarioSelector,
  getScenarioCreationButton,
  getScenarioCreationDialog,
  getScenarioCreationDialogNameField,
  getScenarioCreationDialogMasterCheckbox,
  getScenarioCreationDialogDatasetSelector,
  getScenarioCreationDialogParentScenarioSelector,
  getScenarioCreationDialogRunTypeSelector,
  getScenarioCreationDialogSubmitButton,
  select
};
