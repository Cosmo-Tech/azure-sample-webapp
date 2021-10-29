// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { BREWERY_SELECTORS } from '../../constants/brewery/IdConstants';
import { FileParameters } from '../generic';

// Get tabs elements
function getDatasetPartsTab() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.datasetParts.tabName);
}
function getExtraDatasetPartTab() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.extraDatasetPart.tabName);
}
function getBasicTypesTab() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.tabName);
}

// Get bar parameters components & input fields
function getStock() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.brewery.stockInput);
}
function getRestock() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.brewery.restockInput);
}
function getWaiters() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.brewery.waitersInput);
}
function getStockInput() {
  return getStock().find(GENERIC_SELECTORS.genericComponents.basicNumberInput.input);
}
function getRestockInput() {
  return getRestock().find(GENERIC_SELECTORS.genericComponents.basicNumberInput.input);
}
function getWaitersInput() {
  return getWaiters().find(GENERIC_SELECTORS.genericComponents.basicNumberInput.input);
}

// Get basic types components & input fields
function getCurrency() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currency);
}
function getCurrencyName() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyName);
}
function getCurrencyValue() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyValue);
}
function getCurrencyUsed() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyUsed);
}
function getStartDate() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.startDate);
}

function getCurrencyInput() {
  return getCurrency().find(GENERIC_SELECTORS.genericComponents.basicEnumInput.input);
}
function getCurrencyTextField() {
  return getCurrency().find(GENERIC_SELECTORS.genericComponents.basicEnumInput.textField);
}
function getCurrencyNameInput() {
  return getCurrencyName().find(GENERIC_SELECTORS.genericComponents.basicTextInput.input);
}
function getCurrencyValueInput() {
  return getCurrencyValue().find(GENERIC_SELECTORS.genericComponents.basicNumberInput.input);
}

// Get file parameters elements & buttons
function getExampleDatasetPart1() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.datasetParts.exampleDatasetPart1);
}
function getExampleDatasetPart2() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.datasetParts.exampleDatasetPart2);
}
function getExampleDatasetPart3() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.extraDatasetPart.exampleDatasetPart3);
}

function getExampleDatasetPart1DownloadButton() {
  return FileParameters.getDownloadButton(getExampleDatasetPart1());
}
function getExampleDatasetPart2DownloadButton() {
  return FileParameters.getDownloadButton(getExampleDatasetPart2());
}
function getExampleDatasetPart3DownloadButton() {
  return FileParameters.getDownloadButton(getExampleDatasetPart3());
}

function getExampleDatasetPart1DeleteButton() {
  return FileParameters.getDeleteButton(getExampleDatasetPart1());
}
function getExampleDatasetPart2DeleteButton() {
  return FileParameters.getDeleteButton(getExampleDatasetPart2());
}
function getExampleDatasetPart3DeleteButton() {
  return FileParameters.getDeleteButton(getExampleDatasetPart3());
}

// Switch to a scenario parameters tab
function switchToDatasetPartsTab() {
  getDatasetPartsTab().click();
}
function switchToExtraDatasetPartTab() {
  getExtraDatasetPartTab().click();
}
function switchToBasicTypesTab() {
  getBasicTypesTab().click();
}

// Upload a file parameter
function uploadExampleDatasetPart1(filePath) {
  FileParameters.upload(getExampleDatasetPart1(), filePath);
}
function uploadExampleDatasetPart2(filePath) {
  FileParameters.upload(getExampleDatasetPart2(), filePath);
}
function uploadExampleDatasetPart3(filePath) {
  FileParameters.upload(getExampleDatasetPart3(), filePath);
}

// Download a file parameter
function downloadExampleDatasetPart1() {
  FileParameters.download(getExampleDatasetPart1());
}
function downloadExampleDatasetPart2() {
  FileParameters.download(getExampleDatasetPart2());
}
function downloadExampleDatasetPart3() {
  FileParameters.download(getExampleDatasetPart3());
}

// Delete a file parameter
function deleteExampleDatasetPart1() {
  FileParameters.delete(getExampleDatasetPart1());
}
function deleteExampleDatasetPart2() {
  FileParameters.delete(getExampleDatasetPart2());
}
function deleteExampleDatasetPart3() {
  FileParameters.delete(getExampleDatasetPart3());
}

export const BreweryParameters = {
  getDatasetPartsTab,
  getExtraDatasetPartTab,
  getBasicTypesTab,
  getExampleDatasetPart1,
  getExampleDatasetPart2,
  getExampleDatasetPart3,
  getStock,
  getRestock,
  getWaiters,
  getStockInput,
  getRestockInput,
  getWaitersInput,
  getCurrency,
  getCurrencyName,
  getCurrencyValue,
  getCurrencyUsed,
  getStartDate,
  getCurrencyInput,
  getCurrencyTextField,
  getCurrencyNameInput,
  getCurrencyValueInput,
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
  deleteExampleDatasetPart3,
};
