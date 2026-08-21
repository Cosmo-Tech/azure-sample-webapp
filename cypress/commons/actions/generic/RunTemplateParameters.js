// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { FileParameters } from './FileParameters';

// Generic get & set actions for run template parameters
const getParameterContainer = (id) => cy.get(`[data-cy=${id}]`);
const getParameterInput = (id) => getParameterContainer(id).find(GENERIC_SELECTORS.genericComponents.basicInput.input);

// Per-type getters
const getStringInput = (parameterId) => getParameterInput(`text-input-${parameterId}`);
const checkStringValue = (parameterId, value) => getStringInput(parameterId).should('have.text', value);
const getNumberInput = (parameterId) => getParameterInput(`number-input-${parameterId}`);
const checkNumberValue = (parameterId, value) => getNumberInput(parameterId).should('value', value);
const getSingleSelectInput = (parameterId) => getParameterInput(`single-select-${parameterId}`);
const getSingleSelectOptions = () => cy.get('[data-cy^=single-select-option-$OPTION]');
const getSingleSelectOption = (option) => cy.get(`[data-cy=single-select-option-${option}]`);
const checkSingleSelectValue = (parameterId, value) =>
  getParameterInput(`single-select-${parameterId}`).should('value', value);
const getMultiSelectInput = (parameterId) => getParameterInput(`multi-input-${parameterId}`);
const getMultiSelectOptions = () => cy.get('[data-cy^=multi-select-option-$OPTION]');
const getMultiSelectOption = (option) => cy.get(`[data-cy=multi-select-option-${option}]`);
const checkMultiSelectValue = (parameterId, value) =>
  getParameterInput(`multi-input-${parameterId}`).should('value', value);

const getDateInput = (parameterId) =>
  getParameterContainer(`date-input-${parameterId}`).find(GENERIC_SELECTORS.genericComponents.basicInput.dateGroup);
const checkDateValue = (parameterId, value) => getDateInput(parameterId).contains(value);

const getFileContainer = (parameterId) => getParameterContainer(`file-upload-${parameterId}`);
const getTableContainer = (parameterId) => getParameterContainer(`table-${parameterId}`);

// Per-type setters
const clearString = (parameterId) => getStringInput(parameterId).clear();
const setString = (parameterId, value, clear = true) => {
  if (clear) clearString(parameterId);
  getStringInput(parameterId).type(value);
};
const clearNumber = (parameterId) => getNumberInput(parameterId).clear();
const setNumber = (parameterId, value, clear = true) => {
  if (clear) clearNumber(parameterId);
  getNumberInput(parameterId).type(value);
};
const setSingleSelect = (parameterId, option) => {
  getSingleSelectInput(parameterId).click();
  getSingleSelectOption(option).click();
};
const toggleInMultiSelect = (parameterId, option, blur = false) => {
  getMultiSelectInput(parameterId).click();
  getMultiSelectOption(option).click();
  if (blur) getMultiSelectInput(parameterId).blur();
};

// Custom helpers for File parameters
const getFileBrowseButton = (parameterId) => FileParameters.getBrowseButton(getFileContainer(parameterId));
const getFileDownloadButton = (parameterId) => FileParameters.getDownloadButton(getFileContainer(parameterId));
const getFileDeleteButton = (parameterId) => FileParameters.getDeleteButton(getFileContainer(parameterId));
const getFileName = (parameterId) => FileParameters.getFileName(getFileContainer(parameterId));
const getErrorMessage = (parameterId) => FileParameters.getErrorMessage(getFileContainer(parameterId));
const uploadFile = (parameterId, filePath) => FileParameters.upload(getFileContainer(parameterId), filePath);
const downloadFile = (parameterId) => FileParameters.download(getFileContainer(parameterId));
const deleteFile = (parameterId) => FileParameters.delete(getFileContainer(parameterId));

export const RunTemplateParameters = {
  getParameterContainer,
  getParameterInput,
  getStringInput,
  checkStringValue,
  getNumberInput,
  checkNumberValue,
  getSingleSelectInput,
  getSingleSelectOptions,
  getSingleSelectOption,
  checkSingleSelectValue,
  getMultiSelectInput,
  getMultiSelectOptions,
  getMultiSelectOption,
  checkMultiSelectValue,
  clearString,
  setString,
  clearNumber,
  setNumber,
  setSingleSelect,
  toggleInMultiSelect,
  getDateInput,
  checkDateValue,
  getFileContainer,
  getTableContainer,
  getFileBrowseButton,
  getFileDownloadButton,
  getFileDeleteButton,
  getFileName,
  getErrorMessage,
  uploadFile,
  downloadFile,
  deleteFile,
};
