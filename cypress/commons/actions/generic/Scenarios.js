// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';

// From scenario View
// Get elements
function getScenarioViewTab(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.scenario.tabName, { timeout: timeout * 1000 });
}
function getScenarioView() {
  return cy.get(GENERIC_SELECTORS.scenario.view);
}
function getScenarioLoadingSpinner(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.scenario.loadingSpinner, { timeout: timeout * 1000 });
}
function getScenarioBackdrop(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.scenario.backdrop, { timeout: timeout * 1000 });
}
function getScenarioBackdropSavingText() {
  return cy.get(GENERIC_SELECTORS.scenario.savingText);
}
function getScenarioValidationStatusChip() {
  return cy.get(GENERIC_SELECTORS.scenario.validationStatusChip);
}
function getScenarioValidationStatusChipDeleteIcon() {
  return getScenarioValidationStatusChip().find(GENERIC_SELECTORS.scenario.validationStatusChipDeleteIcon);
}
function getScenarioValidationStatusLoadingSpinner(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.scenario.validationStatusLoadingSpinner, { timeout: timeout * 1000 });
}
function getScenarioValidateButton() {
  return cy.get(GENERIC_SELECTORS.scenario.validateButton);
}
function getScenarioRejectButton() {
  return cy.get(GENERIC_SELECTORS.scenario.rejectButton);
}
function getScenarioRunTemplate() {
  return cy.get(GENERIC_SELECTORS.scenario.runTemplateName);
}
function getScenarioCreationButton() {
  return cy.get(GENERIC_SELECTORS.scenario.createButton);
}
function getScenarioCreationDialog() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.dialog);
}
function getScenarioCreationDialogNameField() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.nameTextField);
}
function getScenarioCreationDialogNameInputErrorLabel() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.errorLabel);
}
function getScenarioCreationDialogMasterCheckbox() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.masterCheckbox);
}
function getScenarioCreationDialogDatasetSelector() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.datasetSelect);
}
function getScenarioCreationDialogDatasetSelectorOptions() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.datasetSelectorOptions);
}
function getScenarioCreationDialogParentScenarioSelector() {
  return getScenarioCreationDialog().find(GENERIC_SELECTORS.genericComponents.hierarchicalComboBox.selector);
}
function getScenarioCreationDialogParentScenarioSelectorOptions() {
  // ListBox component for selector options is not in its associated selector component in DOM, do not use .find() here
  return cy.get(GENERIC_SELECTORS.genericComponents.hierarchicalComboBox.selectorOptions);
}
function getScenarioCreationDialogRunTypeSelector() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.typeSelect);
}
function getScenarioCreationDialogRunTypeSelectorOptions() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.typeSelectorOptions);
}
function getScenarioCreationDialogSubmitButton() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.submitButton);
}
function getScenarioCreationDialogCancelButton() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.cancelButton);
}
function getDashboardPlaceholder() {
  return cy.get(GENERIC_SELECTORS.scenario.dashboard.placeholder);
}
function getDashboardAccordion() {
  return cy.get(GENERIC_SELECTORS.scenario.dashboard.accordion);
}
function getDashboardAccordionSummary() {
  return cy.get(GENERIC_SELECTORS.scenario.dashboard.accordionSummary);
}
function getDashboardAccordionLogsDownloadButton() {
  return cy.get(GENERIC_SELECTORS.scenario.dashboard.accordionLogsDownloadButton);
}

function checkIfReportIsUnsynced(expectedValue) {
  return expectedValue
    ? cy.get(GENERIC_SELECTORS.scenario.dashboard.unsynced).should('exist')
    : cy.get(GENERIC_SELECTORS.scenario.dashboard.synced).should('exist');
}

function switchToScenarioView() {
  getScenarioViewTab().click();
}

// Open scenario creation dialog
function openScenarioCreationDialog() {
  getScenarioCreationButton().should('not.be.disabled').click();
}

// From scenario creation dialog
// Select a parent scenario
function selectParentScenario(scenarioName) {
  getScenarioCreationDialogMasterCheckbox().uncheck();
  getScenarioCreationDialogParentScenarioSelector().click();
  getScenarioCreationDialogParentScenarioSelector().should('not.be.disabled');
  // clear() does not always work, use "{selectAll}{backspace}" instead
  getScenarioCreationDialogParentScenarioSelector().type('{selectAll}{backspace}' + scenarioName);

  // Try to prevent "detached from DOM" cypress error with these 2 instructions
  getScenarioCreationDialogParentScenarioSelectorOptions().contains(scenarioName).should('be.visible');
  getScenarioCreationDialogParentScenarioSelectorOptions().contains(scenarioName).click();
}

// Select a dataset
function selectDataset(dataset) {
  getScenarioCreationDialogMasterCheckbox().check();
  getScenarioCreationDialogDatasetSelector().click();
  getScenarioCreationDialogDatasetSelector().should('not.be.disabled');
  // clear() does not always work, use "{selectAll}{backspace}" instead
  getScenarioCreationDialogDatasetSelector().type('{selectAll}{backspace}' + dataset);

  // Try to prevent "detached from DOM" cypress error with these 2 instructions
  getScenarioCreationDialogDatasetSelectorOptions().contains(dataset).should('be.visible');
  getScenarioCreationDialogDatasetSelectorOptions().contains(dataset).click();
}

// Select a run template
function selectRunTemplate(runTemplate) {
  getScenarioCreationDialogRunTypeSelector().click();
  getScenarioCreationDialogRunTypeSelector().should('not.be.disabled');
  // clear() does not always work, use "{selectAll}{backspace}" instead
  getScenarioCreationDialogRunTypeSelector().type('{selectAll}{backspace}' + runTemplate);

  // Try to prevent "detached from DOM" cypress error with these 2 instructions
  getScenarioCreationDialogRunTypeSelectorOptions().contains(runTemplate).should('be.visible');
  getScenarioCreationDialogRunTypeSelectorOptions().contains(runTemplate).click();
}

function cancelCreateScenario() {
  getScenarioCreationDialogCancelButton().click();
}

function getNewScenarioDescription() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.description);
}

function setNewScenarioDescription(description) {
  getNewScenarioDescription().type(description);
}

function getNewScenarioTags() {
  return cy.get(GENERIC_SELECTORS.scenario.createDialog.tags);
}

function addNewScenarioTag(tag) {
  getNewScenarioTags().type(tag + '{enter}');
}

function createScenario(scenarioName, isMaster, datasetOrMasterName, runTemplate, description, tags) {
  const createScenarioAlias = api.interceptCreateSimulationRunner();

  openScenarioCreationDialog();
  getScenarioCreationDialog().should('be.visible');
  getScenarioCreationDialogNameField().type(scenarioName);
  if (description) setNewScenarioDescription(description);
  if (tags) tags.forEach((tag) => addNewScenarioTag(tag));
  if (isMaster === true) {
    selectDataset(datasetOrMasterName);
  } else {
    selectParentScenario(datasetOrMasterName);
  }
  selectRunTemplate(runTemplate);

  getScenarioCreationDialogSubmitButton().click();
  getScenarioCreationDialog().should('not.exist');

  let scenarioCreated;
  return api.waitAlias(createScenarioAlias).then((req) => {
    scenarioCreated = req.response.body;
    expect(scenarioCreated.name.toLowerCase()).to.equal(scenarioName.toLowerCase());
    expect(scenarioCreated.runTemplateName.toLowerCase()).to.equal(runTemplate.toLowerCase());
    return {
      scenarioCreatedId: scenarioCreated.id,
      scenarioCreatedName: scenarioCreated.name,
      scenarioCreatedDescription: scenarioCreated.description,
      scenarioCreatedTags: scenarioCreated.tags,
      scenarioCreatedOwnerName: scenarioCreated.ownerName,
      scenarioCreatedCreationDate: scenarioCreated.creationDate,
      scenarioCreatedRunTemplateName: runTemplate,
      scenarioCratedDatasetOrMasterName: datasetOrMasterName,
    };
  });
}

function validateScenario(scenarioId) {
  const validateScenarioAlias = api.interceptUpdateSimulationRunner({ scenarioId });
  getScenarioValidateButton().click();
  api.waitAlias(validateScenarioAlias);
}
function rejectScenario(scenarioId) {
  const rejectScenarioAlias = api.interceptUpdateSimulationRunner({ scenarioId });
  getScenarioRejectButton().click();
  api.waitAlias(rejectScenarioAlias);
}
function resetScenarioValidationStatus(scenarioId) {
  const resetScenarioAlias = api.interceptUpdateSimulationRunner({ scenarioId });
  getScenarioValidationStatusChipDeleteIcon().click();
  api.waitAlias(resetScenarioAlias);
}

export const Scenarios = {
  getScenarioView,
  getScenarioViewTab,
  getScenarioLoadingSpinner,
  getScenarioBackdrop,
  getScenarioBackdropSavingText,
  getScenarioValidationStatusChip,
  getScenarioValidationStatusChipDeleteIcon,
  getScenarioValidationStatusLoadingSpinner,
  getScenarioValidateButton,
  getScenarioRejectButton,
  getScenarioRunTemplate,
  getScenarioCreationButton,
  getScenarioCreationDialog,
  getScenarioCreationDialogNameField,
  getScenarioCreationDialogNameInputErrorLabel,
  getScenarioCreationDialogMasterCheckbox,
  getScenarioCreationDialogDatasetSelector,
  getScenarioCreationDialogDatasetSelectorOptions,
  getScenarioCreationDialogParentScenarioSelector,
  getScenarioCreationDialogParentScenarioSelectorOptions,
  getScenarioCreationDialogRunTypeSelector,
  getScenarioCreationDialogRunTypeSelectorOptions,
  getScenarioCreationDialogSubmitButton,
  getScenarioCreationDialogCancelButton,
  getDashboardPlaceholder,
  getDashboardAccordion,
  getDashboardAccordionSummary,
  getDashboardAccordionLogsDownloadButton,
  checkIfReportIsUnsynced,
  switchToScenarioView,
  openScenarioCreationDialog,
  selectParentScenario,
  selectDataset,
  selectRunTemplate,
  createScenario,
  cancelCreateScenario,
  validateScenario,
  rejectScenario,
  resetScenarioValidationStatus,
};
