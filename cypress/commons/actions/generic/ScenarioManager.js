// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';

const getScenarioManagerView = () => {
  return cy.get(GENERIC_SELECTORS.scenario.manager.view);
};

const switchToScenarioManager = (options) => {
  // eslint-disable-next-line cypress/no-force -- Workaround for MUI hidden elements not correctly ignored by cypress
  cy.get(GENERIC_SELECTORS.scenario.manager.tabName).click({ force: true, ...options });
};

const interceptScenarioDeletions = (scenarioIds, runningIds = []) => {
  const getAliases = scenarioIds.map((id) => api.interceptGetRunner(id));
  const deleteAliases = scenarioIds.map((id) => api.interceptDeleteRunner({ id }));
  const stopAliases = runningIds.map(() => api.interceptStopRunner());
  return { getAliases, deleteAliases, stopAliases };
};

const waitForScenarioDeletions = ({ getAliases, deleteAliases, stopAliases }) => {
  getAliases.forEach((alias) => api.waitAlias(alias));
  deleteAliases.forEach((alias) => api.waitAlias(alias));
  stopAliases.forEach((alias) => api.waitAlias(alias));
};

const openScenarioEditDialog = (scenarioId) => {
  openScenarioActionMenu(scenarioId);
  getEditScenarioButton().click();
};

const getScenarioDeleteDialogBody = () => cy.get(GENERIC_SELECTORS.scenario.manager.scenarioDeleteDialog.body);
const getScenarioDeleteDialogItems = () => cy.get(GENERIC_SELECTORS.scenario.manager.scenarioDeleteDialog.items);
const getDeleteCancelButton = () => cy.get(GENERIC_SELECTORS.scenario.manager.rowActionMenu.deleteCancelButton);
const clickDeleteCancelButton = () => getDeleteCancelButton().click();
const getDeleteConfirmButton = () => cy.get(GENERIC_SELECTORS.scenario.manager.rowActionMenu.deleteConfirmButton);
const clickDeleteConfirmButton = () => getDeleteConfirmButton().click();

const deleteScenario = (scenarioId, isRunning = false) => {
  const aliases = interceptScenarioDeletions([scenarioId], isRunning ? [scenarioId] : []);

  writeInFilter(scenarioId);
  openScenarioActionMenu(scenarioId);
  getDeleteScenarioButton().click();
  clickDeleteConfirmButton();
  writeInFilter('');

  waitForScenarioDeletions(aliases);
};

const deleteScenarioList = (scenarioIds, runningIds = []) => {
  switchToScenarioManager();
  const aliases = interceptScenarioDeletions(scenarioIds, runningIds);

  scenarioIds.forEach((scenarioId) => {
    writeInFilter(scenarioId);
    toggleScenarioCheckbox(scenarioId);
  });
  writeInFilter('');

  clickBatchDeleteButton();
  clickDeleteConfirmButton();
  waitForScenarioDeletions(aliases);
};

const writeInFilter = (searchStr) => {
  cy.get(GENERIC_SELECTORS.scenario.manager.search)
    .find('input')
    .type('{selectAll}{backspace}' + searchStr + '{enter}');
};

const getScenarioRow = (scenarioId) => {
  return cy.get(GENERIC_SELECTORS.scenario.manager.scenarioRow.replace('$SCENARIOID', scenarioId));
};

const getScenarioRows = () => {
  return getScenarioManagerView().find(GENERIC_SELECTORS.scenario.manager.scenarioRows, { timeout: 10000 });
};

const getScenarioName = (scenarioId) => {
  return getScenarioRow(scenarioId).find(GENERIC_SELECTORS.scenario.manager.columns.name);
};

const getScenarioOwnerName = (scenarioId) => {
  return getScenarioRow(scenarioId).find(GENERIC_SELECTORS.scenario.manager.columns.owner);
};

const getScenarioCreationDate = (scenarioId) => {
  return getScenarioRow(scenarioId).find(GENERIC_SELECTORS.scenario.manager.columns.created);
};

// Actions for scenario edition dialog
const getScenarioEditionDialog = () => cy.get(GENERIC_SELECTORS.scenario.editDialog.dialog);
const getScenarioEditionDialogNameField = () => cy.get(GENERIC_SELECTORS.scenario.editDialog.nameTextField);
const setEditedScenarioName = (newScenarioName) =>
  getScenarioEditionDialogNameField().type('{selectAll}{backspace}' + newScenarioName);
const getScenarioEditionDialogNameInputErrorLabel = () => cy.get(GENERIC_SELECTORS.scenario.editDialog.errorLabel);
const getScenarioEditionDialogSubmitButton = () => cy.get(GENERIC_SELECTORS.scenario.editDialog.submitButton);
const getScenarioEditionDialogCancelButton = () => cy.get(GENERIC_SELECTORS.scenario.editDialog.cancelButton);
const getEditedScenarioDescription = () => cy.get(GENERIC_SELECTORS.scenario.editDialog.description);
const setEditedScenarioDescription = (description) =>
  getEditedScenarioDescription().type('{selectAll}{backspace}' + description);
const getEditedScenarioNewTagTextField = () => cy.get(GENERIC_SELECTORS.scenario.editDialog.newTagTextField);
const getEditedScenarioTagChips = () => cy.get(GENERIC_SELECTORS.scenario.editDialog.tags);
const addEditedScenarioTag = (newTag) => getEditedScenarioNewTagTextField().type(newTag + '{enter}');
const deleteEditedScenarioTag = (index) =>
  getEditedScenarioTagChips().find(GENERIC_SELECTORS.scenario.tags.cancelIcon).eq(index).click();

const cancelScenarioEdition = () => getScenarioEditionDialogCancelButton().click();

const confirmScenarioEdition = ({ validateRequest }) => {
  const alias = api.interceptUpdateRunner({ validateRequest });
  getScenarioEditionDialogSubmitButton().click();
  api.waitAlias(alias);
};

const getScenarioValidationStatusChip = (scenarioId) => {
  return getScenarioRow(scenarioId).find(GENERIC_SELECTORS.scenario.validationStatusChip);
};

const getScenarioValidationStatusLoadingSpinner = (scenarioId) => {
  return getScenarioRow(scenarioId).find(GENERIC_SELECTORS.scenario.validationStatusLoadingSpinner);
};

const cancelMetadataEdition = () => {
  cy.get('body').type('{esc}');
};

const getScenarioTags = () => {
  return getScenarioInfoTooltip().find(GENERIC_SELECTORS.scenario.manager.infoTags);
};

const getScenarioTag = (index) => {
  return getScenarioInfoTooltip().find(GENERIC_SELECTORS.scenario.manager.infoTagByIndex.replace('$TAGINDEX', index));
};

const checkScenarioTagsChips = (scenarioId, scenarioTags) => {
  hoverScenarioInfoIcon(scenarioId);
  scenarioTags.forEach((tag, index) => getScenarioTag(index).should('have.text', tag));
  closeScenarioInfoTooltip(scenarioId);
};

const checkScenarioDescription = (scenarioId, description) => {
  hoverScenarioInfoIcon(scenarioId);
  getScenarioDescription().should('have.text', description);
  closeScenarioInfoTooltip(scenarioId);
};

const renameScenario = (scenarioId, newScenarioName, validateRequest) => {
  openScenarioEditDialog(scenarioId);
  setEditedScenarioName(newScenarioName);
  confirmScenarioEdition({ validateRequest });
};

const editScenarioDescription = (scenarioId, newDescription, validateRequest) => {
  openScenarioEditDialog(scenarioId);
  setEditedScenarioDescription(newDescription);
  confirmScenarioEdition({ validateRequest });
};

const addScenarioTag = (scenarioId, newTag, validateRequest) => {
  openScenarioEditDialog(scenarioId);
  addEditedScenarioTag(newTag);
  confirmScenarioEdition({ validateRequest });
};

const deleteScenarioTag = (scenarioId, index, validateRequest) => {
  openScenarioEditDialog(scenarioId);
  deleteEditedScenarioTag(index);
  confirmScenarioEdition({ validateRequest });
};

const getScenarioRunTemplate = (scenarioId) => {
  return getScenarioRow(scenarioId).find(GENERIC_SELECTORS.scenario.manager.columns.runType);
};
const getScenarioRunStatus = (scenarioId, timeout = 5) => {
  return getScenarioRow(scenarioId).find(GENERIC_SELECTORS.scenario.manager.columns.runStatus, {
    timeout: timeout * 1000,
  });
};

const getScenarioDataset = (scenarioId) => {
  return getScenarioRow(scenarioId).find(GENERIC_SELECTORS.scenario.manager.columns.dataset);
};

const getScenarioActionMenuButton = (scenarioId) => {
  return getScenarioRow(scenarioId).find(GENERIC_SELECTORS.scenario.manager.columns.actionMenu).find('button');
};

const getScenarioCheckbox = (scenarioId) => {
  return getScenarioRow(scenarioId).find(GENERIC_SELECTORS.scenario.manager.rowActionMenu.checkboxCell).find('input');
};

const toggleScenarioCheckbox = (scenarioId) => {
  getScenarioCheckbox(scenarioId).click();
};

const toggleScenarioCheckboxes = (scenarioIds) => {
  scenarioIds.forEach((id) => toggleScenarioCheckbox(id));
};

const getBatchDeleteButton = () => {
  return cy.get(GENERIC_SELECTORS.scenario.manager.batchDeleteButton);
};

const clickBatchDeleteButton = () => {
  getBatchDeleteButton().click();
};

const openScenarioActionMenu = (scenarioId) => {
  getScenarioActionMenuButton(scenarioId).click();
};

const closeScenarioInfoTooltip = (scenarioId) => {
  cy.get(GENERIC_SELECTORS.scenario.manager.scenarioInfoIcon.replace('$SCENARIOID', scenarioId)).trigger('mouseout');
};

const hoverScenarioInfoIcon = (scenarioId) => {
  cy.get(GENERIC_SELECTORS.scenario.manager.scenarioInfoIcon.replace('$SCENARIOID', scenarioId)).trigger('mouseover');
};

const getScenarioInfoTooltip = () => {
  return cy.get(GENERIC_SELECTORS.scenario.manager.infoTooltip);
};

const getScenarioDescription = () => {
  return getScenarioInfoTooltip().find(GENERIC_SELECTORS.scenario.manager.infoDescription);
};

const getRowActionMenu = () => {
  return cy.get(GENERIC_SELECTORS.scenario.manager.rowActionMenu.menu);
};

const getEditScenarioButton = () => {
  return getRowActionMenu().find(GENERIC_SELECTORS.scenario.manager.rowActionMenu.editButton);
};

const getScenarioViewRedirect = () => {
  return getRowActionMenu().find(GENERIC_SELECTORS.scenario.manager.rowActionMenu.openButton);
};
const openScenarioFromScenarioManager = (scenarioId) => {
  openScenarioActionMenu(scenarioId);
  getScenarioViewRedirect().click();
  cy.url({ timeout: 5000 }).should('include', `/scenario/${scenarioId}`);
};

const getShareScenarioButton = () => {
  return getRowActionMenu().find(GENERIC_SELECTORS.scenario.manager.rowActionMenu.shareButton);
};
const openScenarioSharingDialog = (scenarioId) => {
  openScenarioActionMenu(scenarioId);
  return getShareScenarioButton().click();
};

const getDeleteScenarioButton = () => {
  return getRowActionMenu().find(GENERIC_SELECTORS.scenario.manager.rowActionMenu.deleteButton);
};

const checkScenarioValidationStatus = (scenarioId, expectedStatus) => {
  switch (expectedStatus) {
    case 'Unknown':
      getScenarioValidationStatusChip(scenarioId).should('not.exist');
      getScenarioValidationStatusLoadingSpinner(scenarioId).should('not.exist');
      break;
    case 'Draft':
      getScenarioValidationStatusChip(scenarioId).should('be.visible');
      getScenarioValidationStatusChip(scenarioId).should('have.text', 'Draft');
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
};

export const ScenarioManager = {
  getScenarioManagerView,
  switchToScenarioManager,
  getDeleteScenarioButton,
  openScenarioEditDialog,
  getScenarioDeleteDialogBody,
  getScenarioDeleteDialogItems,
  getDeleteCancelButton,
  clickDeleteCancelButton,
  getDeleteConfirmButton,
  clickDeleteConfirmButton,
  deleteScenario,
  deleteScenarioList,
  writeInFilter,
  getScenarioRow,
  getScenarioRows,
  getScenarioName,
  getScenarioOwnerName,
  getScenarioCreationDate,
  getScenarioEditionDialog,
  getScenarioEditionDialogNameField,
  setEditedScenarioName,
  getScenarioEditionDialogNameInputErrorLabel,
  getScenarioEditionDialogSubmitButton,
  confirmScenarioEdition,
  getScenarioEditionDialogCancelButton,
  cancelScenarioEdition,
  getEditedScenarioDescription,
  setEditedScenarioDescription,
  getEditedScenarioNewTagTextField,
  addEditedScenarioTag,
  deleteEditedScenarioTag,
  renameScenario,
  getScenarioValidationStatusChip,
  getScenarioValidationStatusLoadingSpinner,
  checkScenarioValidationStatus,
  getScenarioRunTemplate,
  getScenarioRunStatus,
  getScenarioDataset,
  getScenarioCheckbox,
  toggleScenarioCheckbox,
  toggleScenarioCheckboxes,
  getBatchDeleteButton,
  clickBatchDeleteButton,
  getScenarioActionMenuButton,
  openScenarioActionMenu,
  closeScenarioInfoTooltip,
  hoverScenarioInfoIcon,
  getScenarioInfoTooltip,
  getScenarioDescription,
  getRowActionMenu,
  getEditScenarioButton,
  getScenarioViewRedirect,
  openScenarioFromScenarioManager,
  getShareScenarioButton,
  openScenarioSharingDialog,
  checkScenarioTagsChips,
  checkScenarioDescription,
  editScenarioDescription,
  cancelMetadataEdition,
  addScenarioTag,
  deleteScenarioTag,
  getScenarioTags,
};
