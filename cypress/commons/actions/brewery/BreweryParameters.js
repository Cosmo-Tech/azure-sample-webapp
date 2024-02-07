// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { BREWERY_SELECTORS } from '../../constants/brewery/IdConstants';
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { FileParameters, TableParameters, ScenarioParameters } from '../generic';

// Get tabs elements
function getFileUploadTab() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.fileUpload.tabName);
}
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
function getEventsTab() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.events.tabName);
}
function getAdditionalParametersTab() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.additionalParameters.tabName);
}

// TODO: remove selector below from idConstants:
// return cy.get(BREWERY_SELECTORS.scenario.parameters.bar.stockInput);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.bar.restockInput);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.bar.waitersInput);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currency);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyName);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyValue);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyUsed);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyNameInput);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyValueInput);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyUsedInput);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.averageConsumption);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.startDateInput);

// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyInDisabledMode);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyNameValueInDisabledMode);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyValueInDisabledMode);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyUsedValueInDisabledMode);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.averageConsumptionValueInDisabledMode);

// return cy.get(BREWERY_SELECTORS.scenario.parameters.events.additionalSeats);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.events.additionalSeatsDisabledValue);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.events.activated);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.events.activatedDisabledValue);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.events.evaluation);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.events.evaluationValueInDisabledMode);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.additionalParameters.volumeUnit);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.additionalParameters.volumeUnitDisabledValue);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.additionalParameters.additionalTables);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.additionalParameters.additionalTablesValueInDisabledMode);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.additionalParameters.comment);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.additionalParameters.commentValueInDisabledMode);

// return cy.get(BREWERY_SELECTORS.scenario.parameters.additionalParameters.additionalDate);
// return cy.get(BREWERY_SELECTORS.scenario.parameters.additionalParameters.additionalDateValueInDisabledMode);

// return getCurrency().find(GENERIC_SELECTORS.genericComponents.basicEnumInput.input);
// return getAverageConsumptionSlider().find(GENERIC_SELECTORS.genericComponents.basicSliderInput.input);
// return getStartDate().find(GENERIC_SELECTORS.genericComponents.basicDateInput.input);

// Get bar parameters components & input fields
const getStock = () => ScenarioParameters.getParameterValue('number-input-stock');
const getStockHelperText = () => cy.get('[id=number-input-stock-helper-text]');
const getStockInput = () => ScenarioParameters.getParameterInput('number-input-stock');
const getRestock = () => ScenarioParameters.getParameterValue('number-input-restock_qty');
const getRestockHelperText = () => cy.get('[id=number-input-restock_qty-helper-text]');
const getRestockInput = () => ScenarioParameters.getParameterInput('number-input-restock_qty');
const getWaiters = () => ScenarioParameters.getParameterValue('number-input-nb_waiters');
const getWaitersHelperText = () => cy.get('[id=number-input-nb_waiters-helper-text]');
const getWaitersInput = () => ScenarioParameters.getParameterInput('number-input-nb_waiters');

const getInitialStock = () => cy.get(BREWERY_SELECTORS.scenario.parameters.fileUpload.initialStockDataset);
const getInitialStockFileName = () => FileParameters.getFileName(getInitialStock());
const getInitialStockDownloadButton = () => FileParameters.getDownloadButton(getInitialStock());
const getInitialStockDeleteButton = () => FileParameters.getDeleteButton(getInitialStock());
const getInitialStockErrorMessage = () => FileParameters.getErrorMessage(getInitialStock());
const uploadInitialStock = (filePath) => FileParameters.upload(getInitialStock(), filePath);
const downloadInitialStock = () => FileParameters.download(getInitialStock());
const deleteInitialStock = () => FileParameters.delete(getInitialStock());

// Get basic types components & input fields
const getCurrencyParameterContainer = () => ScenarioParameters.getParameterContainer('enum-input-currency');
const getCurrency = () => ScenarioParameters.getParameterValue('enum-input-currency');
const getCurrencyInput = () => ScenarioParameters.getParameterInput('enum-input-currency');
const getCurrencyName = () => ScenarioParameters.getParameterValue('text-input-currency_name');
const getCurrencyNameHelperText = () => cy.get('[id=text-input-currency_name-helper-text]');
const getCurrencyNameInput = () => ScenarioParameters.getParameterInput('text-input-currency_name');
const getCurrencyValue = () => ScenarioParameters.getParameterValue('number-input-currency_value');
const getCurrencyValueInput = () => ScenarioParameters.getParameterInput('number-input-currency_value');
const getCurrencyUsed = () => ScenarioParameters.getParameterValue('toggle-input-currency_used');
const getCurrencyUsedInput = () => ScenarioParameters.getParameterInput('toggle-input-currency_used');
const getAverageConsumptionParameterContainer = () =>
  ScenarioParameters.getParameterContainer('slider-input-average_consumption');
const getAverageConsumption = () => ScenarioParameters.getParameterValue('slider-input-average_consumption');
const getAverageConsumptionInput = () => ScenarioParameters.getParameterInput('slider-input-average_consumption');
const getStartDate = () => ScenarioParameters.getParameterValue('date-input-start_date');
const getEndDate = () => ScenarioParameters.getParameterValue('date-input-end_date');
const getStartDateHelperText = () => cy.get('[id=date-text-field-start_date-helper-text]');
const getStartDateInput = () => ScenarioParameters.getParameterInput('date-input-start_date');
const getEndDateInput = () => ScenarioParameters.getParameterInput('date-input-end_date');
const getEndDateHelperText = () => cy.get('[id=date-text-field-end_date-helper-text]');

// Get addition parameters components & input fields
const getAdditionalSeats = () => ScenarioParameters.getParameterValue('number-input-additional_seats');
const getAdditionalSeatsInput = () => ScenarioParameters.getParameterInput('number-input-additional_seats');
const getActivated = () => ScenarioParameters.getParameterValue('toggle-input-activated');
const getActivatedInput = () => ScenarioParameters.getParameterInput('toggle-input-activated');
const getEvaluation = () => ScenarioParameters.getParameterValue('text-input-evaluation');
const getEvaluationHelperText = () => cy.get('[id=text-input-evaluation-helper-text]');
const getEvaluationInput = () => ScenarioParameters.getParameterInput('text-input-evaluation');
const getVolumeUnitParameterContainer = () => ScenarioParameters.getParameterContainer('radio-input-volume_unit');
const getVolumeUnit = () => ScenarioParameters.getParameterValue('radio-input-volume_unit');
const getVolumeUnitInput = () => ScenarioParameters.getParameterInput('radio-input-volume_unit');
const getAdditionalTables = () => ScenarioParameters.getParameterValue('number-input-additional_tables');
const getAdditionalTablesInput = () => ScenarioParameters.getParameterInput('number-input-additional_tables');
const getComment = () => ScenarioParameters.getParameterValue('text-input-comment');
const getCommentHelperText = () => cy.get('[id=text-input-comment-helper-text]');
const getCommentInput = () => ScenarioParameters.getParameterInput('text-input-comment');
const getAdditionalDate = () => ScenarioParameters.getParameterValue('date-input-additional_date');
const getAdditionalDateHelperText = () => cy.get('[id=date-text-field-additional_date-helper-text]');
const getAdditionalDateInput = () => ScenarioParameters.getParameterInput('date-input-additional_date');

function getCurrencyTextField() {
  return getCurrencyParameterContainer().find(GENERIC_SELECTORS.genericComponents.basicEnumInput.textField);
}
function getCurrencySelect() {
  return getCurrencyParameterContainer();
}
function getCurrencySelectValue() {
  return getCurrencyInput();
}
function getCurrencySelectOption(option) {
  getCurrencySelect().click();
  cy.get(BREWERY_SELECTORS.scenario.parameters.basicTypes.currencyOption.replace('$OPTION', option)).click();
}
function getAverageConsumptionSlider() {
  return getAverageConsumptionParameterContainer().find(GENERIC_SELECTORS.genericComponents.basicSliderInput.slider);
}
function moveAverageConsumptionSlider(sliderMovement) {
  getAverageConsumptionSlider()
    .invoke('width')
    .then((value) => {
      const x = (value * sliderMovement) / 10;
      if (x === 0) {
        getAverageConsumptionSlider().click('left');
      } else if (x === value) {
        getAverageConsumptionSlider().click('right');
      } else {
        getAverageConsumptionSlider().click(x, 0);
      }
    });
}
function getVolumeUnitTextField() {
  return getVolumeUnitParameterContainer().find(GENERIC_SELECTORS.genericComponents.basicRadioInput.textField);
}
function getVolumeUnitRadioButton(volumeUnitKey) {
  return cy.get(GENERIC_SELECTORS.genericComponents.basicRadioInput.radioButtonByKey.replace('$KEY', volumeUnitKey));
}
function getVolumeUnitRadioButtonInput(volumeUnitKey) {
  return getVolumeUnitRadioButton(volumeUnitKey).find(GENERIC_SELECTORS.genericComponents.basicInput.input);
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
function getCustomersExportButton() {
  return TableParameters.getExportButton(getCustomersTable());
}
function getCustomersFullscreenButton() {
  return TableParameters.getFullscreenButton(getCustomersTable());
}
function enterCustomersFullscreen() {
  return TableParameters.toggleFullscreenButton(getCustomersTable());
}
function exitCustomersFullscreen() {
  return TableParameters.toggleFullscreenButton(TableParameters.getFullscreenTable());
}
function getCustomersTableHeader() {
  return TableParameters.getHeader(getCustomersTable());
}
function getCustomersTablePlaceholder() {
  return TableParameters.getPlaceholder(getCustomersTable());
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

function getCustomersColumnGroup(columnGroupIndex) {
  return TableParameters.getColumnGroup(getCustomersTable(), columnGroupIndex);
}

function openCustomersColumnGroup(columnGroupIndex) {
  return TableParameters.openColumnGroup(getCustomersTable(), columnGroupIndex);
}

function closeCustomersColumnGroup(columnGroupIndex) {
  return TableParameters.closeColumnGroup(getCustomersTable(), columnGroupIndex);
}

function importCustomersTableData(filePath) {
  return TableParameters.importFile(getCustomersTable(), filePath);
}

function exportCustomersTableDataToCSV(fileName = null) {
  return TableParameters.exportCSV(getCustomersTable(), fileName);
}
function exportCustomersTableDataToXLSX(fileName = null) {
  return TableParameters.exportXLSX(getCustomersTable(), fileName);
}

function addRowCustomersTableData() {
  TableParameters.addRow(getCustomersTable());
}

function getCustomersDeleteRowButton() {
  return TableParameters.getDeleteRowsButton(getCustomersTable());
}
function deleteRowsCustomersTableData(confirm = false) {
  TableParameters.deleteRows(getCustomersTable(), confirm);
}
function deleteRowsEventsTableData(confirm = false) {
  TableParameters.deleteRows(getEventsTable(), confirm);
}

function editCustomersTableStringCell(colName, rowIndex, newValue) {
  return TableParameters.editStringCell(getCustomersTable, colName, rowIndex, newValue);
}

function clearCustomersTableStringCell(colName, rowIndex, useDelKey = false) {
  return TableParameters.clearStringCell(getCustomersTable, colName, rowIndex, useDelKey);
}

function getEventsTable() {
  return cy.get(BREWERY_SELECTORS.scenario.parameters.events.table);
}

function getEventsTableLabel() {
  return TableParameters.getLabel(getEventsTable());
}
function getEventsTableGrid() {
  return TableParameters.getGrid(getEventsTable());
}
function getEventsImportButton() {
  return TableParameters.getImportButton(getEventsTable());
}
function getEventsExportButton() {
  return TableParameters.getExportButton(getEventsTable());
}
function getEventsTableHeader() {
  return TableParameters.getHeader(getEventsTable());
}
function getEventsTableHeaderCell(colName) {
  return TableParameters.getHeaderCell(getEventsTable(), colName);
}

function getEventsTableRowsContainer() {
  return TableParameters.getRowsContainer(getEventsTable());
}
function getEventsTableRows() {
  return TableParameters.getRows(getEventsTable());
}
function getEventsTableRow(rowIndex) {
  return TableParameters.getRow(getEventsTable(), rowIndex);
}
function getEventsTableCell(colName, rowIndex) {
  return TableParameters.getCell(getEventsTable(), colName, rowIndex);
}

function importEventsTableData(filePath) {
  return TableParameters.importFile(getEventsTable(), filePath);
}

function exportEventsTableDataToCSV(fileName = null) {
  return TableParameters.exportCSV(getEventsTable(), fileName);
}
function exportEventsTableDataToXLSX(fileName = null) {
  return TableParameters.exportXLSX(getEventsTable(), fileName);
}

function editEventsTableStringCell(colName, rowIndex, newValue) {
  return TableParameters.editStringCell(getEventsTable, colName, rowIndex, newValue);
}

function clearEventsTableStringCell(colName, rowIndex, useDelKey = false) {
  return TableParameters.clearStringCell(getEventsTable, colName, rowIndex, useDelKey);
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

function getExampleDatasetPart2ErrorMessage() {
  return FileParameters.getErrorMessage(getExampleDatasetPart2());
}

// Switch to a scenario parameters tab
function switchToFileUploadTab() {
  getFileUploadTab().click();
}
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
function switchToEventsTab() {
  getEventsTab().click();
}
function switchToAdditionalParametersTab() {
  getAdditionalParametersTab().click();
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

function checkErrorsPanelFromList(errors, getTable) {
  const errorsCount = errors.length;
  // function call is absolutely required as parameter to avoid issue with regex selector in 'find'
  TableParameters.getErrorsPanel(getTable()).should('be.visible');
  TableParameters.getErrorsHeader(getTable()).should('have.text', `File load failed. ${errorsCount} errors occurred:`);
  TableParameters.getErrorsAccordions(getTable()).should('have.length', errorsCount);
  errors.forEach((error, index) => {
    if (error.summary) {
      TableParameters.getErrorSummary(getTable(), index).should('have.text', error.summary);
    }
    if (error.loc) {
      TableParameters.getErrorLoc(getTable(), index).should('have.text', error.loc);
    }
  });
}

function checkCustomersErrorsPanelFromList(errors) {
  checkErrorsPanelFromList(errors, getCustomersTable);
}

function checkEventsErrorsPanelFromList(errors) {
  checkErrorsPanelFromList(errors, getEventsTable);
}

export const BreweryParameters = {
  getFileUploadTab,
  getDatasetPartsTab,
  getExtraDatasetPartTab,
  getBasicTypesTab,
  getCustomersTab,
  getEventsTab,
  getAdditionalParametersTab,
  getExampleDatasetPart1,
  getExampleDatasetPart2,
  getExampleDatasetPart3,
  getCustomersTable,
  getCustomersTableLabel,
  getCustomersTableGrid,
  getCustomersImportButton,
  getCustomersExportButton,
  getCustomersFullscreenButton,
  enterCustomersFullscreen,
  exitCustomersFullscreen,
  getCustomersTableHeader,
  getCustomersTablePlaceholder,
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
  getCustomersColumnGroup,
  openCustomersColumnGroup,
  closeCustomersColumnGroup,
  importCustomersTableData,
  exportCustomersTableDataToCSV,
  exportCustomersTableDataToXLSX,
  addRowCustomersTableData,
  getCustomersDeleteRowButton,
  deleteRowsCustomersTableData,
  deleteRowsEventsTableData,
  editCustomersTableStringCell,
  getEventsTableLabel,
  getEventsTableGrid,
  getEventsImportButton,
  getEventsExportButton,
  getEventsTableHeader,
  getEventsTableHeaderCell,
  getEventsTableRowsContainer,
  getEventsTableRows,
  getEventsTableRow,
  getEventsTableCell,
  importEventsTableData,
  exportEventsTableDataToCSV,
  exportEventsTableDataToXLSX,
  editEventsTableStringCell,
  getStock,
  getRestock,
  getWaiters,
  getStockInput,
  getRestockInput,
  getWaitersInput,
  getStockHelperText,
  getRestockHelperText,
  getWaitersHelperText,

  getInitialStock,
  getInitialStockFileName,
  getInitialStockDownloadButton,
  getInitialStockDeleteButton,
  getInitialStockErrorMessage,
  uploadInitialStock,
  downloadInitialStock,
  deleteInitialStock,

  getStartDateHelperText,
  getEndDateHelperText,
  getAdditionalDateHelperText,
  getCurrencyParameterContainer,
  getCurrency,
  getCurrencyName,
  getCurrencyValue,
  getCurrencyUsed,
  getStartDate,
  getEndDate,
  getAverageConsumption,
  getAdditionalSeats,
  getActivated,
  getEvaluation,
  getVolumeUnit,
  getAdditionalTables,
  getComment,
  getAdditionalDate,
  getCurrencyInput,
  getCurrencyTextField,
  getCurrencyNameInput,
  getCurrencyValueInput,
  getCurrencyUsedInput,
  getStartDateInput,
  getEndDateInput,
  getAverageConsumptionInput,
  getAverageConsumptionSlider,
  moveAverageConsumptionSlider,
  getAdditionalSeatsInput,
  getActivatedInput,
  getEvaluationInput,
  getVolumeUnitInput,
  getVolumeUnitTextField,
  getVolumeUnitRadioButton,
  getVolumeUnitRadioButtonInput,
  getAdditionalTablesInput,
  getCommentInput,
  getAdditionalDateInput,
  getCurrencyNameHelperText,
  getEvaluationHelperText,
  getCommentHelperText,
  getExampleDatasetPart1FileName,
  getExampleDatasetPart2FileName,
  getExampleDatasetPart3FileName,
  getExampleDatasetPart1DownloadButton,
  getExampleDatasetPart2DownloadButton,
  getExampleDatasetPart3DownloadButton,
  getExampleDatasetPart1DeleteButton,
  getExampleDatasetPart2DeleteButton,
  getExampleDatasetPart3DeleteButton,
  getExampleDatasetPart2ErrorMessage,
  switchToFileUploadTab,
  switchToDatasetPartsTab,
  switchToExtraDatasetPartTab,
  switchToBasicTypesTab,
  switchToCustomersTab,
  switchToEventsTab,
  switchToAdditionalParametersTab,
  uploadExampleDatasetPart1,
  uploadExampleDatasetPart2,
  uploadExampleDatasetPart3,
  downloadExampleDatasetPart1,
  downloadExampleDatasetPart2,
  downloadExampleDatasetPart3,
  deleteExampleDatasetPart1,
  deleteExampleDatasetPart2,
  deleteExampleDatasetPart3,
  clearCustomersTableStringCell,
  clearEventsTableStringCell,
  checkCustomersErrorsPanelFromList,
  checkEventsErrorsPanelFromList,
  getCurrencySelectOption,
  getCurrencySelectValue,
};
