// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';

function getScenarioManagerView() {
  return cy.get(GENERIC_SELECTORS.scenario.manager.view);
}
function switchToScenarioManager() {
  cy.get(GENERIC_SELECTORS.scenario.manager.tabName).click();
}
function getDeleteScenarioButton() {
  return cy.get(GENERIC_SELECTORS.scenario.manager.button.delete);
}
function deleteScenario(scenarioName, isRunning = false) {
  const getScenarioToDeleteAlias = api.interceptGetScenario();
  const deleteScenarioAlias = api.interceptDeleteScenario(scenarioName);
  const reqStopScenarioRunAlias = isRunning && api.interceptStopScenarioRun();
  const getScenariosAlias = api.interceptGetScenarios();

  writeInFilter(scenarioName);
  getDeleteScenarioButton().click();
  cy.get(GENERIC_SELECTORS.scenario.manager.confirmDeleteDialog).contains('button', 'Confirm').click();

  api.waitAlias(getScenarioToDeleteAlias);
  api.waitAlias(deleteScenarioAlias);
  if (isRunning) api.waitAlias(reqStopScenarioRunAlias);
  api.waitAlias(getScenariosAlias);
}

function deleteScenarioList(scenarioNamesToDelete) {
  switchToScenarioManager();
  scenarioNamesToDelete.forEach((scenarioName) => {
    deleteScenario(scenarioName);
  });
}

function writeInFilter(searchStr) {
  cy.get(GENERIC_SELECTORS.scenario.manager.search)
    .find('input')
    .type('{selectAll}{backspace}' + searchStr + '{enter}');
}

function getScenarioAccordions() {
  return cy.get(GENERIC_SELECTORS.scenario.manager.scenarioAccordions);
}

function getScenarioAccordion(scenarioId) {
  return cy.get(GENERIC_SELECTORS.scenario.manager.scenarioAccordion.replace('$SCENARIOID', scenarioId));
}

function getScenarioOwnerName(scenarioId) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.ownerName);
}

function getScenarioCreationDate(scenarioId) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.creationDate);
}

function getRenameScenarioButton(scenarioId) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.manager.button.renameScenario);
}
function getScenarioEditableLink(scenarioId, timeout = 5) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.manager.editableLink, {
    timeout: timeout * 1000,
  });
}
function getScenarioEditableLinkInEditMode(scenarioId, timeout = 5) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.manager.editableLinkInEditMode, {
    timeout: timeout * 1000,
  });
}
function renameScenario(scenarioId, newScenarioName) {
  const renameScenarioAlias = api.interceptUpdateScenario(scenarioId);

  getRenameScenarioButton(scenarioId).click();
  getScenarioEditableLinkInEditMode(scenarioId).type('{selectAll}{backspace}' + newScenarioName + '{enter}');

  api.waitAlias(renameScenarioAlias);
}

function getScenarioValidationStatusChip(scenarioId) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.validationStatusChip);
}

function getScenarioValidationStatusLoadingSpinner(scenarioId) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.validationStatusLoadingSpinner);
}

function getScenarioRunStatus(scenarioId, scenarioStatus, timeout = 5) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.scenarioStatus[scenarioStatus], {
    timeout: timeout * 1000,
  });
}

function getScenarioRunTemplate(scenarioId) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.manager.scenarioRunTemplate);
}

function getScenarioDataset(scenarioId) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.manager.scenarioDataset);
}

function getScenarioViewRedirect(scenarioId) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.scenarioViewRedirect);
}

function openScenarioFromScenarioManager(scenarioId) {
  getScenarioViewRedirect(scenarioId).should('exist');
  api.interceptGetScenario(scenarioId);
  getScenarioViewRedirect(scenarioId).click();
  cy.url({ timeout: 5000 }).should('include', `/scenario/${scenarioId}`);
}

// This function expects the scenario card to be visible, and does not trigger the expanded / collapsed state of the
// scenario card. To check both validation status in a single function call, use checkValidationStatus
function _checkValidationStatusOnceUnsafe(scenarioId, expectedStatus) {
  switch (expectedStatus) {
    case 'Draft':
    case 'Unknown':
      getScenarioValidationStatusChip(scenarioId).should('not.exist');
      getScenarioValidationStatusLoadingSpinner(scenarioId).should('not.exist');
      break;
    case 'Validated':
      getScenarioValidationStatusChip(scenarioId).should('be.visible');
      getScenarioValidationStatusChip(scenarioId).should('have.text', 'Validated');
      getScenarioValidationStatusLoadingSpinner(scenarioId).should('not.exist');
      break;
    case 'Rejected':
      getScenarioValidationStatusChip(scenarioId).should('be.visible');
      getScenarioValidationStatusChip(scenarioId).should('have.text', 'Rejected');
      getScenarioValidationStatusLoadingSpinner(scenarioId).should('not.exist');
      break;
    case 'Loading':
      getScenarioValidationStatusChip(scenarioId).should('not.exist');
      getScenarioValidationStatusLoadingSpinner(scenarioId).should('be.visible');
      break;
    default:
      throw new Error(
        `Unknown expected scenario status "${expectedStatus}". Please use one of ` +
          'Draft, Unknown, Loading, Validated, Rejected.'
      );
  }
}

function checkValidationStatus(searchStr, scenarioId, expectedStatus) {
  writeInFilter(searchStr);
  _checkValidationStatusOnceUnsafe(scenarioId, expectedStatus);
  triggerScenarioAccordionExpandOrCollapse(scenarioId);
  _checkValidationStatusOnceUnsafe(scenarioId, expectedStatus);
  writeInFilter('{esc}');
}

function getScenarioAccordionExpandButton(scenarioId) {
  return getScenarioAccordion(scenarioId).find(GENERIC_SELECTORS.scenario.manager.scenarioAccordionExpandButton);
}

function triggerScenarioAccordionExpandOrCollapse(scenarioId) {
  return getScenarioAccordionExpandButton(scenarioId).click();
}

export const ScenarioManager = {
  getScenarioManagerView,
  switchToScenarioManager,
  getDeleteScenarioButton,
  deleteScenario,
  deleteScenarioList,
  writeInFilter,
  getScenarioAccordions,
  getScenarioAccordion,
  getScenarioOwnerName,
  getScenarioCreationDate,
  getRenameScenarioButton,
  getScenarioEditableLink,
  getScenarioEditableLinkInEditMode,
  renameScenario,
  getScenarioValidationStatusChip,
  getScenarioValidationStatusLoadingSpinner,
  getScenarioRunStatus,
  getScenarioRunTemplate,
  getScenarioDataset,
  getScenarioViewRedirect,
  checkValidationStatus,
  getScenarioAccordionExpandButton,
  triggerScenarioAccordionExpandOrCollapse,
  openScenarioFromScenarioManager,
};
