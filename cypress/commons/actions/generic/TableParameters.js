// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import 'cypress-file-upload';
// Required to call attachFile
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

function getFullscreenTable() {
  return cy.get(GENERIC_SELECTORS.genericComponents.table.fullscreenTable);
}

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

function getFullscreenButton(tableParameterElement) {
  return getGrid(tableParameterElement).find(GENERIC_SELECTORS.genericComponents.table.toolbar.fullscreenButton);
}

function getAddRowButton(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.toolbar.addRowButton);
}

function getDeleteRowsButton(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.toolbar.deleteRowsButton);
}

function getDeleteRowsDialogConfirmButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.table.toolbar.deleteRowsDialogConfirmButton);
}

function getRevertDataButton(tableParameterElement) {
  return tableParameterElement.find(GENERIC_SELECTORS.genericComponents.table.toolbar.revertButton);
}

function getRevertDialogConfirmButton() {
  return cy.get(GENERIC_SELECTORS.genericComponents.table.toolbar.revertDialogConfirmButton);
}

function getHeader(tableParameterElement) {
  return getGrid(tableParameterElement).find(GENERIC_SELECTORS.genericComponents.table.header);
}

function getPlaceholder(tableParameterElement) {
  return getGrid(tableParameterElement).find(GENERIC_SELECTORS.genericComponents.table.placeholder);
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

function getColumnGroupRow(tableParameterElement) {
  return getGrid(tableParameterElement).find(GENERIC_SELECTORS.genericComponents.table.columnGroupRow);
}

function getColumnGroup(tableParameterElement, colGroupIndex) {
  const columnGroupSelector = GENERIC_SELECTORS.genericComponents.table.columnGroup.replace(
    '$COLGROUPNAME',
    colGroupIndex
  );
  return getColumnGroupRow(tableParameterElement).find(columnGroupSelector);
}

function openColumnGroup(tableParameterElement, colGroupIndex) {
  return getColumnGroup(tableParameterElement, colGroupIndex)
    .find(GENERIC_SELECTORS.genericComponents.table.openColumnGroupIcon)
    .click();
}

function closeColumnGroup(tableParameterElement, colGroupIndex) {
  return getColumnGroup(tableParameterElement, colGroupIndex)
    .find(GENERIC_SELECTORS.genericComponents.table.closeColumnGroupIcon)
    .click();
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

function addRow(tableParameterElement) {
  getAddRowButton(tableParameterElement).click();
}

function deleteRows(tableParameterElement, confirm = false) {
  getDeleteRowsButton(tableParameterElement).click();
  if (confirm) getDeleteRowsDialogConfirmButton().click();
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

function toggleFullscreenButton(tableParameterElement) {
  getFullscreenButton(tableParameterElement).click();
}

function editStringCell(getTableElement, colName, rowIndex, newValue) {
  if (newValue.length === 0) return clearStringCell(getTableElement, colName, rowIndex);

  // Add a wait for allow grid to finish refreshing before getCell
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(0);

  // Entering and leaving the edition mode cause re-renders of the cell element in the DOM, hence the need for multiple
  // calls to getCell
  getCell(getTableElement(), colName, rowIndex).click();
  getCell(getTableElement(), colName, rowIndex).type('{selectAll}{backspace}', { delay: 100 });
  getCell(getTableElement(), colName, rowIndex).type(newValue + '{enter}', { delay: 100 });
  return getCell(getTableElement(), colName, rowIndex);
}

function clearStringCell(getTableElement, colName, rowIndex, useDelKey = false) {
  // Add a wait for allow grid to finish refreshing before getCell
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(0);

  if (useDelKey) {
    getCell(getTableElement(), colName, rowIndex).click();
    getCell(getTableElement(), colName, rowIndex).type('{del}');
  } else {
    getCell(getTableElement(), colName, rowIndex).dblclick();
    getCell(getTableElement(), colName, rowIndex).type('{backspace}' + '{enter}');
  }

  return getCell(getTableElement(), colName, rowIndex);
}

function revertTableData(tableParameterElement) {
  getRevertDataButton(tableParameterElement).click();
  getRevertDialogConfirmButton().click();
}

export const TableParameters = {
  getFullscreenTable,
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
  getAddRowButton,
  getDeleteRowsButton,
  getFullscreenButton,
  toggleFullscreenButton,
  getHeader,
  getPlaceholder,
  getHeaderCell,
  getRowsContainer,
  getRows,
  getRow,
  getCell,
  getColumnGroup,
  openColumnGroup,
  closeColumnGroup,
  importFile,
  exportFile,
  exportCSV,
  exportXLSX,
  addRow,
  deleteRows,
  cancelFileExport,
  confirmFileExport,
  switchFileExportType,
  setFileExportName,
  editStringCell,
  clearStringCell,
  revertTableData,
  getRevertDataButton,
};
