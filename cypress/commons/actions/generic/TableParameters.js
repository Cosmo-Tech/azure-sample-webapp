// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import 'cypress-file-upload'; // Required to call attachFile
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

function getLabel(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.label);
}

function getGrid(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.grid);
}

function getErrorsPanel(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.errorsPanel);
}

function getErrorsHeader(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.errorsHeader);
}

function getErrorsAccordions(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.errorAccordions);
}

function getErrorAccordion(tableParameterElement, errorIndex) {
  const errorSelector = GENERIC_SELECTORS.genericComponents.table.errorAccordionByIndex.replace(
    '$ERRORINDEX',
    errorIndex
  );
  return tableParameterElement.find(errorSelector);
}

function getErrorSummary(tableParameterElement, errorIndex) {
  return getErrorAccordion(tableParameterElement, errorIndex).find(
    GENERIC_SELECTORS.genericComponents.table.errorSummary
  );
}

function getErrorLoc(tableParameterElement, errorIndex) {
  return getErrorAccordion(tableParameterElement, errorIndex).find(GENERIC_SELECTORS.genericComponents.table.errorLoc);
}

function getImportButton(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.importButton);
}

function getImportButtonInput(tableParameterElement) {
  return getImportButton(tableParameterElement).find(GENERIC_SELECTORS.genericComponents.table.importButtonInput);
}

function getExportButton(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.export.openDialogButton);
}
function getExportDialog() {
  return cy.get(GENERIC_SELECTORS.genericComponents.table.export.dialog);
}
function getExportFileTypeContainer() {
  return getExportDialog().find(GENERIC_SELECTORS.genericComponents.table.export.fileTypeSelectContainer);
}
function getExportFileTypeSelect() {
  return getExportDialog().find(GENERIC_SELECTORS.genericComponents.table.export.fileTypeSelect);
}
function getTableExportFileTypeSelectOption(extension) {
  const optionSelector = GENERIC_SELECTORS.genericComponents.table.export.fileTypeSelectOptionByExtension.replace(
    '$EXTENSION',
    extension
  );
  return cy.get(optionSelector);
}
function getExportFileNameInput() {
  return getExportDialog().find(GENERIC_SELECTORS.genericComponents.table.export.fileNameInput);
}
function getExportCancelButton() {
  return getExportDialog().find(GENERIC_SELECTORS.genericComponents.table.export.cancelButton);
}
function getExportConfirmButton() {
  return getExportDialog().find(GENERIC_SELECTORS.genericComponents.table.export.confirmButton);
}

function getHeader(tableParameterElement) {
  return getGrid(tableParameterElement).find(GENERIC_SELECTORS.genericComponents.table.header);
}

function getHeaderCell(tableParameterElement, colName) {
  const colSelector = GENERIC_SELECTORS.genericComponents.table.colByName.replace('$COLNAME', colName);
  return getHeader(tableParameterElement).find(colSelector);
}

function getRowsContainer(tableParameterElement) {
  return getGrid(tableParameterElement).find(GENERIC_SELECTORS.genericComponents.table.rowsContainer);
}

function getRows(tableParameterElement) {
  return getRowsContainer(tableParameterElement).find(GENERIC_SELECTORS.genericComponents.table.row);
}

function getRow(tableParameterElement, rowIndex) {
  const rowSelector = GENERIC_SELECTORS.genericComponents.table.rowByIndex.replace('$ROWINDEX', rowIndex);
  return getRowsContainer(tableParameterElement).find(rowSelector);
}

function getCell(tableParameterElement, colName, rowIndex) {
  const colSelector = GENERIC_SELECTORS.genericComponents.table.colByName.replace('$COLNAME', colName);
  return getRow(tableParameterElement, rowIndex).find(colSelector);
}

// Get the "Import File" button from the provided table element and upload the file provided by filePath
// (path must be relative to the cypress "fixtures" folder)
function importFile(tableParameterElement, filePath) {
  getImportButtonInput(tableParameterElement).attachFile(filePath);
}

function exportFile(tableParameterElement, fileExtension = 'csv', fileName = null) {
  if (['csv', 'xlsx'].includes(fileExtension) === false) {
    console.error(`Unexpected Table export type "${fileExtension}"`);
  }
  getExportButton(tableParameterElement).click();
  switchFileExportType(fileExtension);
  if (fileName) setFileExportName(fileName);
  confirmFileExport();
}
function exportCSV(tableParameterElement, fileName = null) {
  exportFile(tableParameterElement, 'csv', fileName);
}
function exportXLSX(tableParameterElement, fileName = null) {
  exportFile(tableParameterElement, 'xlsx', fileName);
}

function cancelFileExport() {
  getExportCancelButton().click();
}
function confirmFileExport() {
  getExportConfirmButton().click();
}
function switchFileExportType(fileExtension) {
  getExportFileTypeSelect().click();
  getTableExportFileTypeSelectOption(fileExtension).click();
}
function setFileExportName(fileName) {
  getExportFileNameInput().type('{selectAll}{backspace}' + fileName + '{enter}');
}

function editStringCell(getTableElement, colName, rowIndex, newValue) {
  // Add a wait for allow grid to finish refreshing before getCell
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(0);

  // Entering and leaving the edition mode cause re-renders of the cell element in the DOM, hence the need for multiple
  // calls to getCell
  getCell(getTableElement(), colName, rowIndex).dblclick();
  getCell(getTableElement(), colName, rowIndex).type(newValue + '{enter}');
  return getCell(getTableElement(), colName, rowIndex);
}

function clearStringCell(getTableElement, colName, rowIndex) {
  // Add a wait for allow grid to finish refreshing before getCell
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(0);

  getCell(getTableElement(), colName, rowIndex).dblclick();
  getCell(getTableElement(), colName, rowIndex).type('{backspace}' + '{enter}');
  return getCell(getTableElement(), colName, rowIndex);
}

export const TableParameters = {
  getLabel,
  getGrid,
  getErrorsPanel,
  getErrorsHeader,
  getErrorsAccordions,
  getErrorAccordion,
  getErrorSummary,
  getErrorLoc,
  getImportButton,
  getImportButtonInput,
  getExportButton,
  getExportDialog,
  getExportFileTypeContainer,
  getExportFileTypeSelect,
  getExportFileNameInput,
  getExportCancelButton,
  getExportConfirmButton,
  getHeader,
  getHeaderCell,
  getRowsContainer,
  getRows,
  getRow,
  getCell,
  importFile,
  exportFile,
  exportCSV,
  exportXLSX,
  cancelFileExport,
  confirmFileExport,
  switchFileExportType,
  setFileExportName,
  editStringCell,
  clearStringCell,
};
