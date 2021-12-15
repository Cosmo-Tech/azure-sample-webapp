// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

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

function getCSVExportButton(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.csvExportButton);
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

function exportCSV(tableParameterElement) {
  getCSVExportButton(tableParameterElement).click();
}

function editStringCell(getTableElement, colName, rowIndex, newValue) {
  // Entering and leaving the edition mode cause re-renders of the cell element in the DOM, hence the need for multiple
  // calls to getCell
  getCell(getTableElement(), colName, rowIndex).dblclick();
  return getCell(getTableElement(), colName, rowIndex).type(newValue + '{enter}');
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
  getCSVExportButton,
  getHeader,
  getHeaderCell,
  getRowsContainer,
  getRows,
  getRow,
  getCell,
  importFile,
  exportCSV,
  editStringCell,
};
