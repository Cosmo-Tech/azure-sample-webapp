// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { PAGE_NAME, URL_ROOT, URL_REGEX } from '../../constants/generic/TestConstants';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

// From scenario View
// Get elements
function getScenarioViewTab() {
  return cy.get(GENERIC_SELECTORS.scenario.tabName);
}
function getScenarioView() {
  return cy.get(GENERIC_SELECTORS.scenario.view);
}
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

function switchToScenarioView() {
  getScenarioViewTab().click();
}

// Select the scenario with the provided name and id
function selectScenario(scenarioName, scenarioId) {
  const reqName = `requestSelectScenario_${scenarioName}`.replaceAll(' ', '');
  const scenarioUrlRegex = new RegExp(`^${URL_ROOT}/.*${PAGE_NAME.SCENARIOS}/${scenarioId}`);
  cy.intercept('GET', scenarioUrlRegex).as(reqName);
  getScenarioSelector()
    .click()
    .clear()
    .type(scenarioName + '{downarrow}{enter}');
  cy.wait(`@${reqName}`).its('response').its('body').its('name').should('equal', scenarioName);
}

// Open scenario creation dialog
function openScenarioCreationDialog() {
  getScenarioCreationButton().click();
}

// From scenario creation dialog
// Select a parent scenario
function selectParentScenario(scenarioName) {
  getScenarioCreationDialogMasterCheckbox().uncheck();
  getScenarioCreationDialog().click().find(GENERIC_SELECTORS.scenario.selectInput).click();
  cy.contains(scenarioName).should('be.visible').click();
}

// Select a dataset
function selectDataset(dataset) {
  getScenarioCreationDialogMasterCheckbox().check();
  getScenarioCreationDialogDatasetSelector().click();
  cy.contains(dataset).should('be.visible').click();
}

// Select a run template
function selectRunTemplate(runTemplate) {
  getScenarioCreationDialogRunTypeSelector().clear().type(runTemplate);
  return cy.contains(runTemplate);
}

function createScenario(scenarioName, isMaster, datasetOrMasterName, runTemplate) {
  openScenarioCreationDialog();
  getScenarioCreationDialog().should('be.visible');

  getScenarioCreationDialogNameField().type(scenarioName);

  if (isMaster === true) {
    selectDataset(datasetOrMasterName);
  } else {
    selectParentScenario(datasetOrMasterName);
  }

  /* eslint-disable cypress/no-force */
  selectRunTemplate(runTemplate).should('be.visible').click({ force: true });

  const scenarioCreationAlias = 'requestCreateScenario_' + scenarioName.replaceAll(' ', '');
  const scenarioListUpdateAlias = 'requestUpdateScenarioList_' + scenarioName.replaceAll(' ', '');
  cy.intercept('POST', URL_REGEX.SCENARIO_PAGE).as(scenarioCreationAlias);
  cy.intercept('GET', URL_REGEX.SCENARIO_PAGE).as(scenarioListUpdateAlias);

  getScenarioCreationDialogSubmitButton().click();

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

  return getScenarioSelector()
    .find('input')
    .should('have.value', scenarioName)
    .then(() => {
      return {
        scenarioCreatedId,
        scenarioCreatedName,
      };
    });
}

export const Scenarios = {
  getScenarioView,
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
  switchToScenarioView,
  selectScenario,
  openScenarioCreationDialog,
  selectParentScenario,
  selectDataset,
  selectRunTemplate,
  createScenario,
};
