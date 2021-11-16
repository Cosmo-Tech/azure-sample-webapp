// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { PAGE_NAME, URL_ROOT } from '../../constants/generic/TestConstants';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

// Get elements in scenario view
function getScenarioSelector() {
  return cy.get(GENERIC_SELECTORS.scenario.selectInput);
}
function getScenarioSelectorInput() {
  return getScenarioSelector().find('input');
}
function getScenarioCreationButton() {
  return cy.get(GENERIC_SELECTORS.scenario.createButton);
}
function getScenarioCreationDialog() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.dialog);
}
function getScenarioCreationDialogNameField() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.nameTextfield);
}
function getScenarioCreationDialogMasterCheckbox() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.masterCheckbox);
}
function getScenarioCreationDialogDatasetSelector() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.datasetSelect);
}
function getScenarioCreationDialogParentScenarioSelector() {
  return getScenarioCreationDialog().find(GENERIC_SELECTORS.scenario.selectInput);
}
function getScenarioCreationDialogRunTypeSelector() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.typeSelect);
}
function getScenarioCreationDialogSubmitButton() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.submitButton);
}
function getDashboardPlaceholder() {
  return cy.get(GENERIC_SELECTORS.scenario.dashboard.placeholder);
}

// Open scenario creation dialog
function openScenarioCreationDialog() {
  getScenarioCreationButton().click();
}

// From scenario creation dialog, select a run template
function selectRunTemplate(runTemplate) {
  getScenarioCreationDialogRunTypeSelector().clear().type(runTemplate);
  return cy.contains(runTemplate);
}

// From scenario view, select the scenario with the provided name and id
function select(scenarioName, scenarioId) {
  const reqName = `requestSelectScenario_${scenarioName}`.replaceAll(' ', '');
  const scenarioUrlRegex = new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/${scenarioId}`);
  cy.intercept('GET', scenarioUrlRegex).as(reqName);
  getScenarioSelector()
    .click()
    .clear()
    .type(scenarioName + '{downarrow}{enter}');
  cy.wait(`@${reqName}`).its('response').its('body').its('name').should('equal', scenarioName);
}

export const Scenarios = {
  getScenarioSelector,
  getScenarioSelectorInput,
  getScenarioCreationButton,
  getScenarioCreationDialog,
  getScenarioCreationDialogNameField,
  getScenarioCreationDialogMasterCheckbox,
  getScenarioCreationDialogDatasetSelector,
  getScenarioCreationDialogParentScenarioSelector,
  getScenarioCreationDialogRunTypeSelector,
  getScenarioCreationDialogSubmitButton,
  getDashboardPlaceholder,
  openScenarioCreationDialog,
  selectRunTemplate,
  select,
};
