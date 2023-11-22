// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

function getDatasetManagerTab(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.datasetmanager.tabName, { timeout: timeout * 1000 });
}

function getDatasetManagerView(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.datasetmanager.view, { timeout: timeout * 1000 });
}

function switchToDatasetManagerView() {
  return getDatasetManagerTab().click();
}

function getNoDatasetsPlaceholder(timeout = 5) {
  return cy.get(GENERIC_SELECTORS.datasetmanager.noDatasetsPlaceholder, { timeout: timeout * 1000 });
}

function getCreateDatasetButton() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.createDatasetButton);
}

function getDatasetMetadataCard() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.metadata.card);
}

function getDatasetMetadataAuthor() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.metadata.author);
}
function getDatasetMetadataCreationDate() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.metadata.creationDate);
}
function getDatasetMetadataRefreshDate() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.metadata.refreshDate);
}
function getDatasetMetadataSourceType() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.metadata.sourceType);
}
function getDatasetMetadataApiUrl() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.metadata.apiUrl);
}
function getDatasetMetadataApiUrlButton() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.metadata.apiUrlButton);
}
function getDatasetMetadataEditDescriptionButton() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.metadata.editDescriptionButton);
}
function getDatasetMetadataDescriptionTextfield() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.metadata.descriptionTextfield);
}
function getDatasetMetadataDescription() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.metadata.description);
}

function getDatasetCreationDialog() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.wizard.dialog);
}
function getCancelDatasetCreation() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.wizard.cancelDatasetCreation);
}
function getDatasetCreationPreviousStep() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.wizard.confirmDatasetCreation);
}
function getDatasetCreationNextStep() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.wizard.next);
}
function getConfirmDatasetCreation() {
  return cy.get(GENERIC_SELECTORS.datasetmanager.wizard.previous);
}

export const DatasetManager = {
  getDatasetManagerTab,
  switchToDatasetManagerView,
  getDatasetManagerView,
  getNoDatasetsPlaceholder,
  getCreateDatasetButton,
  getDatasetMetadataCard,
  getDatasetMetadataAuthor,
  getDatasetMetadataCreationDate,
  getDatasetMetadataRefreshDate,
  getDatasetMetadataSourceType,
  getDatasetMetadataApiUrl,
  getDatasetMetadataApiUrlButton,
  getDatasetMetadataEditDescriptionButton,
  getDatasetMetadataDescriptionTextfield,
  getDatasetMetadataDescription,
  getDatasetCreationDialog,
  getCancelDatasetCreation,
  getDatasetCreationPreviousStep,
  getDatasetCreationNextStep,
  getConfirmDatasetCreation,
};
