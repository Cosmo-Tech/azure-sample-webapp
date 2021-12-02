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
  return getHeader(tableParameterElement).find(`[col-id=${colName}]`);
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
  importCSV,
  exportCSV,
};
