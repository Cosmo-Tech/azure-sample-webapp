// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { SELECTORS } from '../../IdConstants';
import { FileParameters } from '../generic';

// Get tabs elements
function getDatasetPartsTab () {
  return cy.get(SELECTORS.scenario.parameters.datasetParts.tabName);
}
function getExtraDatasetPartTab () {
  return cy.get(SELECTORS.scenario.parameters.extraDatasetPart.tabName);
}
function getBasicTypesTab () {
  return cy.get(SELECTORS.scenario.parameters.basicTypes.tabName);
}

// Get file parameters input elements
function getExampleDatasetPart1 () {
  return cy.get(SELECTORS.scenario.parameters.datasetParts.exampleDatasetPart1);
}
function getExampleDatasetPart2 () {
  return cy.get(SELECTORS.scenario.parameters.datasetParts.exampleDatasetPart2);
}
function getExampleDatasetPart3 () {
  return cy.get(SELECTORS.scenario.parameters.extraDatasetPart.exampleDatasetPart3);
}

function getExampleDatasetPart1DownloadButton () {
  return FileParameters.getDownloadButton(getExampleDatasetPart1());
}
function getExampleDatasetPart2DownloadButton () {
  return FileParameters.getDownloadButton(getExampleDatasetPart2());
}
function getExampleDatasetPart3DownloadButton () {
  return FileParameters.getDownloadButton(getExampleDatasetPart3());
}

function getExampleDatasetPart1DeleteButton () {
  return FileParameters.getDeleteButton(getExampleDatasetPart1());
}
function getExampleDatasetPart2DeleteButton () {
  return FileParameters.getDeleteButton(getExampleDatasetPart2());
}
function getExampleDatasetPart3DeleteButton () {
  return FileParameters.getDeleteButton(getExampleDatasetPart3());
}

// Switch to a scenario parameters tab
function switchToDatasetPartsTab () {
  getDatasetPartsTab().click();
}
function switchToExtraDatasetPartTab () {
  getExtraDatasetPartTab().click();
}
function switchToBasicTypesTab () {
  getBasicTypesTab().click();
}

// Upload a file parameter
function uploadExampleDatasetPart1 (filePath) {
  FileParameters.upload(getExampleDatasetPart1(), filePath);
}
function uploadExampleDatasetPart2 (filePath) {
  FileParameters.upload(getExampleDatasetPart2(), filePath);
}
function uploadExampleDatasetPart3 (filePath) {
  FileParameters.upload(getExampleDatasetPart3(), filePath);
}

// Download a file parameter
function downloadExampleDatasetPart1 () {
  FileParameters.download(getExampleDatasetPart1());
}
function downloadExampleDatasetPart2 () {
  FileParameters.download(getExampleDatasetPart2());
}
function downloadExampleDatasetPart3 () {
  FileParameters.download(getExampleDatasetPart3());
}

// Delete a file parameter
function deleteExampleDatasetPart1 () {
  FileParameters.delete(getExampleDatasetPart1());
}
function deleteExampleDatasetPart2 () {
  FileParameters.delete(getExampleDatasetPart2());
}
function deleteExampleDatasetPart3 () {
  FileParameters.delete(getExampleDatasetPart3());
}

export const BreweryParameters = {
  getDatasetPartsTab,
  getExtraDatasetPartTab,
  getBasicTypesTab,
  getExampleDatasetPart1,
  getExampleDatasetPart2,
  getExampleDatasetPart3,
  getExampleDatasetPart1DownloadButton,
  getExampleDatasetPart2DownloadButton,
  getExampleDatasetPart3DownloadButton,
  getExampleDatasetPart1DeleteButton,
  getExampleDatasetPart2DeleteButton,
  getExampleDatasetPart3DeleteButton,
  switchToDatasetPartsTab,
  switchToExtraDatasetPartTab,
  switchToBasicTypesTab,
  uploadExampleDatasetPart1,
  uploadExampleDatasetPart2,
  uploadExampleDatasetPart3,
  downloadExampleDatasetPart1,
  downloadExampleDatasetPart2,
  downloadExampleDatasetPart3,
  deleteExampleDatasetPart1,
  deleteExampleDatasetPart2,
  deleteExampleDatasetPart3
};
