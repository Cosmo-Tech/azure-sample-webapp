// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { BREWERY_SELECTORS } from '../../constants/brewery/IdConstants';
import { FileParameters, TableParameters } from '../generic';

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
function getCustomersTab() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.customers.tabName);
}

// Get bar parameters components & input fields
function getStock() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.bar.stockInput);
}
function getRestock() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.bar.restockInput);
}
function getWaiters() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.bar.waitersInput);
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
  return cy.get(BREWERY_SELECTORS.scenario.parameters.datasetParts.exampleDatasetPart1, { timeout: 10000 });
}
function getExampleDatasetPart2() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.datasetParts.exampleDatasetPart2);
}
function getExampleDatasetPart3() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.extraDatasetPart.exampleDatasetPart3);
}
function getCustomersTable() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.customers.table);
}

function getCustomersTableLabel() {
  return TableParameters.getLabel(getCustomersTable());
}
function getCustomersTableGrid() {
  return TableParameters.getGrid(getCustomersTable());
}
function getCustomersImportButton() {
  return TableParameters.getImportButton(getCustomersTable());
}
function getCustomersCSVExportButton() {
  return TableParameters.getCSVExportButton(getCustomersTable());
}
function getCustomersTableHeader() {
  return TableParameters.getHeader(getCustomersTable());
}
function getCustomersTableHeaderCell(colName) {
  return TableParameters.getHeaderCell(getCustomersTable(), colName);
}

function getCustomersTableRowsContainer() {
  return TableParameters.getRowsContainer(getCustomersTable());
}
function getCustomersTableRows() {
  return TableParameters.getRows(getCustomersTable());
}
function getCustomersTableRow(rowIndex) {
  return TableParameters.getRow(getCustomersTable(), rowIndex);
}
function getCustomersTableCell(colName, rowIndex) {
  return TableParameters.getCell(getCustomersTable(), colName, rowIndex);
}

function getCustomersErrorsPanel() {
  return TableParameters.getErrorsPanel(getCustomersTable());
}
function getCustomersErrorsHeader() {
  return TableParameters.getErrorsHeader(getCustomersTable());
}
function getCustomersErrorsAccordions() {
  return TableParameters.getErrorsAccordions(getCustomersTable());
}
function getCustomersErrorAccordion(errorIndex) {
  return TableParameters.getErrorAccordion(getCustomersTable(), errorIndex);
}
function getCustomersErrorSummary(errorIndex) {
  return TableParameters.getErrorSummary(getCustomersTable(), errorIndex);
}
function getCustomersErrorLoc(errorIndex) {
  return TableParameters.getErrorLoc(getCustomersTable(), errorIndex);
}

function importCustomersTableData(filePath) {
  return TableParameters.importFile(getCustomersTable(), filePath);
}

function exportCustomersTableDataToCSV() {
  return TableParameters.exportCSV(getCustomersTable());
}

function editCustomersTableStringCell(colName, rowIndex, newValue) {
  return TableParameters.editStringCell(getCustomersTable, colName, rowIndex, newValue);
}

function getExampleDatasetPart1FileName() {
  return FileParameters.getFileName(getExampleDatasetPart1());
}
function getExampleDatasetPart2FileName() {
  return FileParameters.getFileName(getExampleDatasetPart2());
}
function getExampleDatasetPart3FileName() {
  return FileParameters.getFileName(getExampleDatasetPart3());
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
function switchToCustomersTab() {
  getCustomersTab().click();
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
  getCustomersTab,
  getExampleDatasetPart1,
  getExampleDatasetPart2,
  getExampleDatasetPart3,
  getCustomersTable,
  getCustomersTableLabel,
  getCustomersTableGrid,
  getCustomersImportButton,
  getCustomersCSVExportButton,
  getCustomersTableHeader,
  getCustomersTableHeaderCell,
  getCustomersTableRowsContainer,
  getCustomersTableRows,
  getCustomersTableRow,
  getCustomersTableCell,
  getCustomersErrorsPanel,
  getCustomersErrorsHeader,
  getCustomersErrorsAccordions,
  getCustomersErrorAccordion,
  getCustomersErrorSummary,
  getCustomersErrorLoc,
  importCustomersTableData,
  exportCustomersTableDataToCSV,
  editCustomersTableStringCell,
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
  getExampleDatasetPart1FileName,
  getExampleDatasetPart2FileName,
  getExampleDatasetPart3FileName,
  getExampleDatasetPart1DownloadButton,
  getExampleDatasetPart2DownloadButton,
  getExampleDatasetPart3DownloadButton,
  getExampleDatasetPart1DeleteButton,
  getExampleDatasetPart2DeleteButton,
  getExampleDatasetPart3DeleteButton,
  switchToDatasetPartsTab,
  switchToExtraDatasetPartTab,
  switchToBasicTypesTab,
  switchToCustomersTab,
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
