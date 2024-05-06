// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';
import { FileParameters } from './FileParameters.js';

const SELECTORS = GENERIC_SELECTORS.datasetmanager;

export const getDatasetManagerTab = (timeout = 5) => cy.get(SELECTORS.tabName, { timeout: timeout * 1000 });
export const getDatasetManagerView = (timeout = 5) => cy.get(SELECTORS.view, { timeout: timeout * 1000 });
export const switchToDatasetManagerView = () => getDatasetManagerTab().click();

export const getNoDatasetsPlaceholder = (timeout = 5) =>
  cy.get(SELECTORS.noDatasetsPlaceholder, { timeout: timeout * 1000 });
export const getNoDatasetsPlaceholderViewerSubtitle = (timeout = 5) =>
  cy.get(SELECTORS.noDatasetsViewerSubtitle, { timeout: timeout * 1000 });
export const getNoDatasetsPlaceholderUserSubtitle = (timeout = 5) =>
  cy.get(SELECTORS.noDatasetsUserSubtitle, { timeout: timeout * 1000 });

export const getCreateDatasetButton = () => cy.get(SELECTORS.createDatasetButton);
export const startDatasetCreation = () => getCreateDatasetButton().click();
export const getCreateSubdatasetButton = () => cy.get(SELECTORS.createSubdatasetButton);
export const startSubdatasetCreation = () => getCreateSubdatasetButton().click();

export const getDatasetSearchBar = () => cy.get(SELECTORS.list.searchBar);
export const getDatasetSearchBarInput = () =>
  getDatasetSearchBar().find(GENERIC_SELECTORS.genericComponents.basicInput.input);
export const getDatasetsList = () => cy.get(SELECTORS.list.container);
export const getDatasetsListItemButtons = () => getDatasetsList().find(SELECTORS.list.listItemButtons);
export const getDatasetsListItemButton = (datasetId) =>
  cy.get(SELECTORS.list.listItemButtonByDatasetId.replace('$DATASETID', datasetId));
export const getDatasetRefreshButton = (datasetId) =>
  cy.get(SELECTORS.list.refreshButtonByDatasetId.replace('$DATASETID', datasetId));
export const getAllReuploadDatasetButtons = () => cy.get(SELECTORS.list.reuploadButtons);
export const getDatasetReuploadButton = (datasetId) =>
  cy.get(SELECTORS.list.reuploadButtonByDatasetId.replace('$DATASETID', datasetId));
export const getAllReuploadDatasetInputs = () => cy.get(SELECTORS.list.reuploadInputs);
export const getDatasetReuploadInput = (datasetId) =>
  cy.get(SELECTORS.list.reuploadInputByDatasetId.replace('$DATASETID', datasetId));
export const getAllRefreshDatasetSpinners = (timeout) =>
  cy.get(SELECTORS.list.refreshSpinners, timeout ? { timeout: timeout * 1000 } : undefined);
export const getRefreshDatasetSpinner = (datasetId) =>
  cy.get(SELECTORS.list.refreshSpinnerByDatasetId.replace('$DATASETID', datasetId));
export const getRefreshDatasetErrorIcon = (datasetId) =>
  cy.get(SELECTORS.list.refreshErrorIconByDatasetId.replace('$DATASETID', datasetId));
export const getConfirmDatasetRefreshButton = () => cy.get(SELECTORS.confirmRefreshButton);
export const getAllDeleteDatasetButtons = () => cy.get(SELECTORS.list.deleteButtons);
export const getDatasetDeleteButton = (datasetId) =>
  cy.get(SELECTORS.list.deleteButtonByDatasetId.replace('$DATASETID', datasetId));
export const getDeleteDatasetDialog = () => cy.get(SELECTORS.delete.dialog);
export const getDeleteDatasetDialogBody = () => cy.get(SELECTORS.delete.dialogBody);
export const getDeleteDatasetCancelButton = () => cy.get(SELECTORS.delete.cancelButton);
export const getDeleteDatasetConfirmButton = () => cy.get(SELECTORS.delete.confirmButton);
export const getDatasetsListItemText = (datasetId) =>
  cy.get(SELECTORS.list.listItemTextByDatasetId.replace('$DATASETID', datasetId));
export const getDatasetShareButton = (datasetId) =>
  cy.get(GENERIC_SELECTORS.genericComponents.rolesEdition.shareButton);

export const selectDatasetById = (datasetId) => getDatasetsListItemButton(datasetId).click();

export const getDatasetMetadataCard = () => cy.get(SELECTORS.metadata.card);
export const getDatasetMetadataAuthor = () => cy.get(SELECTORS.metadata.author);
export const getDatasetMetadataCreationDate = () => cy.get(SELECTORS.metadata.creationDate);
export const getDatasetMetadataRefreshDate = () => cy.get(SELECTORS.metadata.refreshDate);
export const getDatasetMetadataSourceType = () => cy.get(SELECTORS.metadata.sourceType);
export const getDatasetMetadataApiUrl = () => cy.get(SELECTORS.metadata.apiUrl);
export const getDatasetMetadataApiUrlButton = () => cy.get(SELECTORS.metadata.apiUrlButton);
export const getDatasetMetadataEditDescriptionButton = () => cy.get(SELECTORS.metadata.editDescriptionButton);
export const getDatasetMetadataDescriptionTextField = () => cy.get(SELECTORS.metadata.descriptionTextField);
export const getDatasetMetadataDescription = () => cy.get(SELECTORS.metadata.description);
export const getDatasetMetadataParent = () => cy.get(SELECTORS.metadata.parent);

export const getDatasetMetadataNewTagTextField = () => cy.get(SELECTORS.metadata.newTagTextField);
export const getDatasetMetadataAddTagButton = () => cy.get(SELECTORS.metadata.addTagButton);
export const getDatasetMetadataDeleteTagButton = (parent) => {
  if (parent) return parent.find(SELECTORS.metadata.deleteTagButton);
  return cy.get(SELECTORS.metadata.deleteTagButton);
};
export const getDatasetMetadataTagsContainer = () => cy.get(SELECTORS.metadata.tagsContainer);
export const getDatasetMetadataTags = () => cy.get(SELECTORS.metadata.tags);
export const getDatasetMetadataTag = (index) => cy.get(SELECTORS.metadata.tagByIndex.replace('$INDEX', index));

export const getDatasetNameInOverview = (timeout) =>
  cy.get(SELECTORS.overview.datasetName, timeout ? { timeout: timeout * 1000 } : undefined);
export const getDatasetOverviewPlaceholder = (timeout) =>
  cy.get(SELECTORS.overview.placeholder.container, timeout ? { timeout: timeout * 1000 } : undefined);
export const getDatasetOverviewPlaceholderTitle = (timeout) =>
  cy.get(SELECTORS.overview.placeholder.title, timeout ? { timeout: timeout * 1000 } : undefined);
export const getDatasetOverviewPlaceholderRetryButton = () => cy.get(SELECTORS.overview.placeholder.retryButton);
export const getDatasetOverviewPlaceholderRollbackButton = () => cy.get(SELECTORS.overview.placeholder.rollbackButton);
export const getDatasetOverviewPlaceholderApiLink = () => cy.get(SELECTORS.overview.placeholder.apiLink);

export const getIndicatorCard = (kpiId) => cy.get(SELECTORS.overview.indicators.cardByKpiId.replace('$KPI_ID', kpiId));
export const getKpiLoading = (parent) => parent.find(SELECTORS.overview.indicators.kpiLoading);
export const getKpiValue = (parent, timeout) =>
  parent.find(SELECTORS.overview.indicators.kpiValue, timeout ? { timeout: timeout * 1000 } : undefined);
export const getKpiError = (parent) => parent.find(SELECTORS.overview.indicators.kpiError);
export const getKpiUnknownState = (parent) => parent.find(SELECTORS.overview.indicators.kpiUnknownState);

// Parameters
//  - newDescription: string containing the new value for the dataset description
//  - options is an optional parameter, it must be an object with the following properties:
//    - id (optional): id of the dataset to update (if not provided, it will be guessed from the request URL)
//    - validateRequest (optional): validation function to run on the dataset update request
export const editDatasetDescription = (newDescription, options) => {
  const updateDatasetAlias = api.interceptUpdateDataset({
    id: options?.id,
    validateRequest: options?.validateRequest,
  });
  getDatasetMetadataDescription().trigger('mouseover');
  getDatasetMetadataEditDescriptionButton().should('exist').click();
  getDatasetMetadataDescriptionTextField().type('{selectAll}{backspace}' + newDescription + '{ctrl}{enter}');
  api.waitAlias(updateDatasetAlias);
};

// Parameters
//  - newTag: string containing the new tag to add
//  - options is an optional parameter, it must be an object with the following properties:
//    - id (optional): id of the dataset to update (if not provided, it will be guessed from the request URL)
//    - validateRequest (optional): validation function to run on the dataset update request
export const addDatasetTag = (newTag, options) => {
  const updateDatasetAlias = api.interceptUpdateDataset({
    id: options?.id,
    validateRequest: options?.validateRequest,
  });

  getDatasetMetadataTags().trigger('mouseover');
  getDatasetMetadataAddTagButton().should('exist').click();
  getDatasetMetadataNewTagTextField().type(newTag + '{enter}');
  api.waitAlias(updateDatasetAlias);
};

// Parameters
//  - tagIndex: index of the tag to remove (starting at index 0)
//  - options is an optional parameter, it must be an object with the following properties:
//    - id (optional): id of the dataset to delete (if not provided, it will be guessed from the request URL)
//    - validateRequest (optional): validation function to run on the dataset update request
export const deleteDatasetTag = (tagIndex, options) => {
  const updateDatasetAlias = api.interceptUpdateDataset({
    id: options?.id,
    validateRequest: options?.validateRequest,
  });
  const tag = getDatasetMetadataTag(tagIndex);
  getDatasetMetadataDeleteTagButton(tag).click();
  api.waitAlias(updateDatasetAlias);
};

export const getDatasetCreationDialog = () => cy.get(SELECTORS.wizard.dialog);
export const getParentNameSubtitle = () => cy.get(SELECTORS.wizard.parentNameSubtitle);
export const getCancelDatasetCreation = () => cy.get(SELECTORS.wizard.cancelDatasetCreation);
export const getDatasetCreationPreviousStep = () => cy.get(SELECTORS.wizard.previous);
export const getDatasetCreationNextStep = () => cy.get(SELECTORS.wizard.next);
export const getConfirmDatasetCreation = () => cy.get(SELECTORS.wizard.confirmDatasetCreation);

// Parameters
//  - options is an optional parameter, it must be an object with the following properties:
//    - id (optional): id of the created dataset (only used when stubbing is enabled; if undefined, a random id is used)
//    - validateRequest (optional): validation function to run on the dataset update request
//    - importJobOptions: options to provide to the interception of the "create dataset" query (default: undefined)
//    - runnerCreationOptions: options to provide to the interception of the "create runner" query (default: undefined)
//    - runnerUpdateOptions: options to provide to the interception of the "update runner" query (default: undefined)
//    - isFile: boolean defining if the created dataset is imported from a file upload (when enabled, queries to refresh
//      and status endpoints won't be run)
//    - isETL: boolean defining if the created dataset is created from an ETL runner (when enabled, queries to create
//      and patch the runner will be run)
export const confirmDatasetCreation = (options = {}) => {
  options.customDatasetPatch = {
    main: true,
    ...options.customDatasetPatch,
  };
  const aliases = [];
  if (options.isETL) aliases.push(api.interceptCreateRunner(options.runnerCreationOptions));
  aliases.push(api.interceptCreateDataset(options, options.importJobOptions));
  aliases.push(api.interceptLinkDataset());
  if (options.isETL) aliases.push(api.interceptUpdateRunner(options.runnerUpdateOptions));

  if (!options.isFile) {
    aliases.push(api.interceptRefreshDataset());
    aliases.push(api.interceptGetDatasetStatus(options.importJobOptions?.expectedPollsCount));
  }
  getConfirmDatasetCreation().click();
  api.waitAliases(aliases);
};

export const getNewDatasetDescription = () => cy.get(SELECTORS.wizard.description);
export const setNewDatasetDescription = (description) => getNewDatasetDescription().type(description);
export const getNewDatasetName = () => cy.get(SELECTORS.wizard.name);
export const getNewDatasetNameInput = () =>
  getNewDatasetName().find(GENERIC_SELECTORS.genericComponents.basicInput.input);
export const setNewDatasetName = (name) => getNewDatasetName().type(name + '{enter}');
export const getNewDatasetTagsContainer = () => cy.get(SELECTORS.wizard.tagsContainer);
export const getNewDatasetTagsInput = () => cy.get(SELECTORS.wizard.tagsInput);
export const getNewDatasetTag = (index) => cy.get(SELECTORS.wizard.tagByIndex.replace('$INDEX', index));

export const getNewDatasetDeleteTagButtons = () => getNewDatasetTagsContainer().find(SELECTORS.wizard.deleteTagButton);
export const addNewDatasetTag = (newTag) => getNewDatasetTagsInput().type(newTag + '{enter}');
export const deleteNewDatasetTag = (tagIndex) => getNewDatasetDeleteTagButtons().eq(tagIndex).click();
export const getNewDatasetLocationOptionExistingData = () => cy.get(SELECTORS.wizard.locationOptionExistingData);
export const selectNewDatasetFromExistingData = () => getNewDatasetLocationOptionExistingData().click();
export const getNewDatasetLocationOptionFromScratch = () => cy.get(SELECTORS.wizard.locationOptionFromScratch);
export const selectNewDatasetFromScratch = () => getNewDatasetLocationOptionFromScratch().click();
export const getNewDatasetSourceTypeSelect = () => cy.get(SELECTORS.wizard.sourceTypeSelect);
export const getNewDatasetSourceTypeOptionsMenu = () => cy.get(SELECTORS.wizard.sourceTypeOptionsMenu);
export const getNewDatasetSourceTypeOptions = () =>
  getNewDatasetSourceTypeOptionsMenu().find(SELECTORS.wizard.sourceTypeOptions);
export const getNewDatasetSourceTypeOption = (runTemplateId) =>
  getNewDatasetSourceTypeOptionsMenu().find(
    SELECTORS.wizard.sourceTypeOption.replace('$RUN_TEMPLATE_ID', runTemplateId)
  );
export const getNewDatasetSourceTypeOptionAzureStorage = () => cy.get(SELECTORS.wizard.sourceTypeOptionAzureStorage);
export const getNewDatasetSourceTypeOptionFile = () => cy.get(SELECTORS.wizard.sourceTypeOptionFile);
export const getNewDatasetSourceTypeOptionADT = () => cy.get(SELECTORS.wizard.sourceTypeOptionADT);
export const getNewDatasetAzureStorageAccountName = () => cy.get(SELECTORS.wizard.azureStorageAccountName);
export const getNewDatasetAzureStorageContainerName = () => cy.get(SELECTORS.wizard.azureStorageContainerName);
export const getNewDatasetAzureStoragePath = () => cy.get(SELECTORS.wizard.azureStoragePath);
export const getNewDatasetADTURL = () => cy.get(SELECTORS.wizard.adtURL);
export const selectNewDatasetSourceType = (runTemplateId) => {
  getNewDatasetSourceTypeSelect().click();
  getNewDatasetSourceTypeOption(runTemplateId).click();
};

export const setNewDatasetAzureStorageAccountName = (value) =>
  getNewDatasetAzureStorageAccountName().type('{selectAll}{backspace}' + value);
export const setNewDatasetAzureStorageContainerName = (value) =>
  getNewDatasetAzureStorageContainerName().type('{selectAll}{backspace}' + value);
export const setNewDatasetAzureStoragePath = (value) =>
  getNewDatasetAzureStoragePath().type('{selectAll}{backspace}' + value);
export const setNewDatasetADTURL = (value) => getNewDatasetADTURL().type('{selectAll}{backspace}' + value);

export const uploadFileInWizard = (filePath) => FileParameters.upload(getDatasetCreationDialog(), filePath);

export const closeDeleteDatasetDialog = () => {
  getDeleteDatasetCancelButton().click();
  getDeleteDatasetDialog().should('not.exist');
};

export const deleteDataset = (datasetId, datasetName) => {
  const deleteDatasetAlias = api.interceptDeleteDataset(datasetName);
  getDatasetDeleteButton(datasetId).click();
  getDeleteDatasetDialog().should('be.visible');
  getDeleteDatasetDialogBody().contains(datasetName);
  getDeleteDatasetConfirmButton().click();
  api.waitAlias(deleteDatasetAlias);
};

export const refreshDataset = (datasetId, options) => {
  const aliases = [
    api.interceptRefreshDatasetAndPollStatus(datasetId, options),
    api.interceptGetDatasetStatus(options.expectedPollsCount),
  ];
  getDatasetRefreshButton(datasetId).click();
  getConfirmDatasetRefreshButton().click();
  getRefreshDatasetSpinner(datasetId).should('be.visible');
  api.waitAliases(aliases);
};

export const rollbackDatasetStatus = () => {
  const alias = api.interceptRollbackDatasetStatus();
  getDatasetOverviewPlaceholderRollbackButton().click();
  api.waitAlias(alias);
};

// Parameters:
//   - response (optional): JSON response to the twingraph query that is simulated if stubbing is enabled. Example:
//       [{"id":"Dynamic value 1"},{"id":"Dynamic value 2"},{"id":"Dynamic value 3"}]
//   - validateRequest (optional): a function, taking the request object as argument, that can be used to perform
//       cypress checks on the content of the intercepted query
// Return value: a callback function to call in your test to wait for the interception
export const expectDatasetTwingraphQuery = (response = {}, validateRequest) => {
  const alias = api.interceptPostDatasetTwingraphQuery(response, validateRequest);
  return () => api.waitAlias(alias);
};
