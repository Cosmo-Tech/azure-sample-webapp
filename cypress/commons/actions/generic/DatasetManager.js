// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';

const SELECTORS = GENERIC_SELECTORS.datasetmanager;

export const getDatasetManagerTab = (timeout = 5) => cy.get(SELECTORS.tabName, { timeout: timeout * 1000 });
export const getDatasetManagerView = (timeout = 5) => cy.get(SELECTORS.view, { timeout: timeout * 1000 });
export const switchToDatasetManagerView = () => getDatasetManagerTab().click();
export const getNoDatasetsPlaceholder = (timeout = 5) =>
  cy.get(SELECTORS.noDatasetsPlaceholder, { timeout: timeout * 1000 });
export const getCreateDatasetButton = () => cy.get(SELECTORS.createDatasetButton);
export const startDatasetCreation = () => getCreateDatasetButton().click();

export const getDatasetSearchBar = () => cy.get(SELECTORS.list.searchBar);
export const getDatasetsList = () => cy.get(SELECTORS.list.container);
export const getDatasetsListItemButtons = () => getDatasetsList().find(SELECTORS.list.listItemButtons);
export const getDatasetsListItemButton = (datasetId) =>
  cy.get(SELECTORS.list.listItemButtonByDatasetId.replace('$DATASETID', datasetId));
export const getDatasetRefreshButton = (datasetId) =>
  cy.get(SELECTORS.list.refreshButtonByDatasetId.replace('$DATASETID', datasetId));
export const getDatasetDeleteButton = (datasetId) =>
  cy.get(SELECTORS.list.deleteButtonByDatasetId.replace('$DATASETID', datasetId));
export const getDatasetsListItemText = (datasetId) =>
  cy.get(SELECTORS.list.listItemTextByDatasetId.replace('$DATASETID', datasetId));
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

export const getDatasetMetadataNewTagTextField = () => cy.get(SELECTORS.metadata.newTagTextField);
export const getDatasetMetadataAddTagButton = () => cy.get(SELECTORS.metadata.addTagButton);
export const getDatasetMetadataDeleteTagButton = (parent) => {
  if (parent) return parent.find(SELECTORS.metadata.deleteTagButton);
  return cy.get(SELECTORS.metadata.deleteTagButton);
};
export const getDatasetMetadataTagsContainer = () => cy.get(SELECTORS.metadata.tagsContainer);
export const getDatasetMetadataTags = () => cy.get(SELECTORS.metadata.tags);

export const getDatasetMetadataTag = (index) => cy.get(SELECTORS.metadata.tagByIndex.replace('$INDEX', index));

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
export const getCancelDatasetCreation = () => cy.get(SELECTORS.wizard.cancelDatasetCreation);
export const getDatasetCreationPreviousStep = () => cy.get(SELECTORS.wizard.previous);
export const getDatasetCreationNextStep = () => cy.get(SELECTORS.wizard.next);
export const getConfirmDatasetCreation = () => cy.get(SELECTORS.wizard.confirmDatasetCreation);

// Parameters
//  - options is an optional parameter, it must be an object with the following properties:
//    - id (optional): id of the created dataset (only used when stubbing is enabled; if undefined, a random id is used)
//    - validateRequest (optional): validation function to run on the dataset update request
//    - importJobOptions: options to provide to the interception of the "create dataset" query (default: undefined)
export const confirmDatasetCreation = (options = {}) => {
  options.customDatasetPatch = {
    main: true,
    ...options.customDatasetPatch,
  };
  const aliases = [
    api.interceptCreateDataset(options, options.importJobOptions),
    api.interceptRefreshDataset(),
    api.interceptGetDatasetStatus(options.importJobOptions?.expectedPollsCount),
  ];
  getConfirmDatasetCreation().click();
  api.waitAliases(aliases);
};

export const getNewDatasetDescription = () => cy.get(SELECTORS.wizard.description);
export const setNewDatasetDescription = (description) => getNewDatasetDescription().type(description);
export const getNewDatasetName = () => cy.get(SELECTORS.wizard.name);
export const setNewDatasetName = (name) => getNewDatasetName().type(name + '{enter}');
export const getNewDatasetTagsContainer = () => cy.get(SELECTORS.wizard.tagsContainer);
export const getNewDatasetTagsInput = () => cy.get(SELECTORS.wizard.tagsInput);
export const getNewDatasetDeleteTagButtons = () => getNewDatasetTagsContainer().find(SELECTORS.wizard.deleteTagButton);
export const addNewDatasetTag = (newTag) => getNewDatasetTagsInput().type(newTag + '{enter}');
export const deleteNewDatasetTag = (tagIndex) => getNewDatasetDeleteTagButtons().eq(tagIndex).click();
export const getNewDatasetLocationOptionExistingData = () => cy.get(SELECTORS.wizard.locationOptionExistingData);
export const selectNewDatasetFromExistingData = () => getNewDatasetLocationOptionExistingData().click();
export const getNewDatasetLocationOptionFromScratch = () => cy.get(SELECTORS.wizard.locationOptionFromScratch);
export const selectNewDatasetFromScratch = () => getNewDatasetLocationOptionFromScratch().click();
export const getNewDatasetSourceTypeSelect = () => cy.get(SELECTORS.wizard.sourceTypeSelect);
export const getNewDatasetSourceTypeOptionAzureStorage = () => cy.get(SELECTORS.wizard.sourceTypeOptionAzureStorage);
export const getNewDatasetSourceTypeOptionFile = () => cy.get(SELECTORS.wizard.sourceTypeOptionFile);
export const getNewDatasetSourceTypeOptionADT = () => cy.get(SELECTORS.wizard.sourceTypeOptionADT);
export const getNewDatasetAzureStorageAccountName = () => cy.get(SELECTORS.wizard.azureStorageAccountName);
export const getNewDatasetAzureStorageContainerName = () => cy.get(SELECTORS.wizard.azureStorageContainerName);
export const getNewDatasetAzureStoragePath = () => cy.get(SELECTORS.wizard.azureStoragePath);
export const getNewDatasetADTURL = () => cy.get(SELECTORS.wizard.adtURL);

export const setNewDatasetAzureStorageAccountName = (value) =>
  getNewDatasetAzureStorageAccountName().type('{selectAll}{backspace}' + value);
export const setNewDatasetAzureStorageContainerName = (value) =>
  getNewDatasetAzureStorageContainerName().type('{selectAll}{backspace}' + value);
export const setNewDatasetAzureStoragePath = (value) =>
  getNewDatasetAzureStoragePath().type('{selectAll}{backspace}' + value);
export const setNewDatasetADTURL = (value) => getNewDatasetADTURL().type('{selectAll}{backspace}' + value);
