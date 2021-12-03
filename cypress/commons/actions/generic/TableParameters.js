// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

function getLabel(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.label);
}

function getGrid(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.grid);
}

function getCSVImportButton(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.csvImportButton);
}

function getCSVImportButtonInput(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.csvImportButtonInput);
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

// Get the "Import CSV" button from the provided table element and upload the file provided by filePath (path must be
// relative to the cypress "fixtures" folder)
function importCSV(tableParameterElement, filePath) {
  getCSVImportButtonInput(tableParameterElement).attachFile(filePath);
}

function exportCSV(tableParameterElement) {
  getCSVExportButton(tableParameterElement).click();
}

export const TableParameters = {
  getLabel,
  getGrid,
  getCSVImportButton,
  getCSVImportButtonInput,
  getCSVExportButton,
  getHeader,
  getHeaderCell,
  getRowsContainer,
  getRows,
  getRow,
  getCell,
  importCSV,
  exportCSV,
};
