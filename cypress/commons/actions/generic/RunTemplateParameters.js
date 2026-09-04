// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { FileParameters } from './FileParameters';

// Generic get & set actions for run template parameters
const getParameterContainer = (id) => cy.get(`[data-cy=${id}]`);
const getParameterInput = (id) => getParameterContainer(id).find(GENERIC_SELECTORS.genericComponents.basicInput.input);

const getBoolInput = (parameterId) => getParameterInput(`toggle-input-${parameterId}`);
const checkBoolValue = (parameterId, value) => getBoolInput(parameterId).should('value', value);

const getStringInput = (parameterId) => getParameterInput(`text-input-${parameterId}`);
const checkStringValue = (parameterId, value) => getStringInput(parameterId).should('value', value);
const clearString = (parameterId) => getStringInput(parameterId).clear();
const setString = (parameterId, value, clear = true) => {
  if (clear) clearString(parameterId);
  getStringInput(parameterId).type(value, { force: true });
};

const getNumberInput = (parameterId) => getParameterInput(`number-input-${parameterId}`);
const checkNumberValue = (parameterId, value) => getNumberInput(parameterId).should('value', value);
const clearNumber = (parameterId) => getNumberInput(parameterId).clear();
const setNumber = (parameterId, value, clear = true) => {
  if (clear) clearNumber(parameterId);
  getNumberInput(parameterId).type(value, { force: true });
};

const getSlider = (parameterId) => cy.get(`[data-cy=slider-input-${parameterId}]`);
const checkSliderValue = (parameterId, value) => getSlider(parameterId).find('input').should('value', value);
const setSlider = (parameterId, { min, max, value }) => {
  const getSliderElement = () => getSlider(parameterId).children().eq(1);
  getSliderElement()
    .invoke('width')
    .then((width) => {
      // FIXME: fix formula to support generic min/max options
      const x = (width * value) / (max - min || 1);
      if (x === 0) getSliderElement().click('left');
      else if (x === width) getSliderElement().click('right');
      else getSliderElement().click(x, 0);
    });
};

const getEnumDropdown = (parameterId) => cy.get(`[data-cy=enum-input-${parameterId}]`);
const getEnumDropdownMenu = (parameterId) => cy.get(`[data-cy=enum-input-menu-${parameterId}]`);
// TODO: add a better data-cy selector in the UI component, the current one is "data-cy={option.key}"
const getEnumOptions = (parameterId) => getEnumDropdownMenu(parameterId).find('[data-value^=""]');
const getEnumOption = (parameterId, value) => getEnumDropdownMenu(parameterId).find(`[data-value=${value}]`);
// FIXME: no value selector yet in the generic enum component
// const checkEnumValue = (parameterId, value) => getEnumDropdownMenu(parameterId).should('value', value);
const setEnumValue = (parameterId, value) => {
  getEnumDropdown(parameterId).click();
  getEnumOption(parameterId, value).click();
};
const checkEnumValue = (parameterId, value) => getEnumDropdown(parameterId).should('contain', value);

const getRadioButtonGroup = (parameterId) => cy.get(`[data-cy=radio-input-${parameterId}]`);
const getRadioButtonOption = (parameterId, value) =>
  getRadioButtonGroup(parameterId).find(`[data-cy=radio-button-${value}]`);
const setRadioButtonOption = (parameterId, value) =>
  getRadioButtonGroup(parameterId).find(`[data-cy=radio-button-${value}]`).click();
const checkRadioButtonOptionIsSelected = (parameterId, value) =>
  getRadioButtonOption(parameterId, value).should('have.class', 'Mui-checked');

const getScenarioSelectInput = (parameterId) => getParameterInput(`single-select-${parameterId}`);
const getScenarioSelectOptions = () => cy.get('[data-cy^=single-select-option-$OPTION]');
const getScenarioSelectOption = (option) => cy.get(`[data-cy=single-select-option-${option}]`);
const checkScenarioSelectValue = (parameterId, value) =>
  getParameterInput(`single-select-${parameterId}`).should('value', value);
const clearScenarioSelect = (parameterId) => getScenarioSelectInput(parameterId).click().clear().blur();
const setScenarioSelect = (parameterId, option) => {
  getScenarioSelectInput(parameterId).click();
  getScenarioSelectOption(option).click();
};

const getMultiSelectInput = (parameterId) => getParameterInput(`multi-input-${parameterId}`);
const getMultiSelectOptions = () => cy.get('[data-cy^=multi-select-option-$OPTION]');
const getMultiSelectOption = (option) => cy.get(`[data-cy=multi-select-option-${option}]`);
const checkMultiSelectInputFieldValue = (parameterId, value) =>
  getParameterInput(`multi-input-${parameterId}`).should('value', value);
const checkMultiSelectOptionValue = (option, mustBeChecked) => {
  if (mustBeChecked) getMultiSelectOption(option).find('span').should('have.class', 'Mui-checked');
  else getMultiSelectOption(option).find('span').should('not.have.class', 'Mui-checked');
};
const toggleInMultiSelect = (parameterId, options, blur = false) => {
  getMultiSelectInput(parameterId).click();
  if (Array.isArray(options)) options.forEach((option) => getMultiSelectOption(option).click());
  else getMultiSelectOption(options).click();
  if (blur) getMultiSelectInput(parameterId).blur();
};

const getDateInput = (parameterId) =>
  getParameterContainer(`date-input-${parameterId}`).find(GENERIC_SELECTORS.genericComponents.basicInput.dateGroup);
const checkDateValue = (parameterId, value) => getDateInput(parameterId).contains(value);
const checkDateFieldIsEmpty = (parameterId) => {
  const getSpan = (i) => getDateInput(parameterId).find(`span[data-sectionindex="${i}"]`);
  getSpan(0).should('have.text', 'MM/');
  getSpan(1).should('have.text', 'DD/');
  getSpan(2).should('have.text', 'YYYY');
};

const getFileContainer = (parameterId) => getParameterContainer(`file-upload-${parameterId}`);
const getFileBrowseButton = (parameterId) => FileParameters.getBrowseButton(getFileContainer(parameterId));
const getFileDownloadButton = (parameterId) => FileParameters.getDownloadButton(getFileContainer(parameterId));
const getFileDeleteButton = (parameterId) => FileParameters.getDeleteButton(getFileContainer(parameterId));
const getFileName = (parameterId) => FileParameters.getFileName(getFileContainer(parameterId));
const getErrorMessage = (parameterId) => FileParameters.getErrorMessage(getFileContainer(parameterId));
const uploadFile = (parameterId, filePath) => FileParameters.upload(getFileContainer(parameterId), filePath);
const downloadFile = (parameterId, options) => FileParameters.download(getFileContainer(parameterId), options);
const deleteFile = (parameterId) => FileParameters.delete(getFileContainer(parameterId));

const getTableContainer = (parameterId) => getParameterContainer(`table-${parameterId}`);

export const RunTemplateParameters = {
  getParameterContainer,
  getParameterInput,
  getBoolInput,
  checkBoolValue,
  getStringInput,
  checkStringValue,
  clearString,
  setString,
  getNumberInput,
  checkNumberValue,
  clearNumber,
  setNumber,
  getSlider,
  checkSliderValue,
  setSlider,
  getEnumDropdown,
  getEnumDropdownMenu,
  getEnumOptions,
  getEnumOption,
  // checkEnumValue,
  setEnumValue,
  checkEnumValue,
  getRadioButtonGroup,
  getRadioButtonOption,
  setRadioButtonOption,
  checkRadioButtonOptionIsSelected,
  getScenarioSelectInput,
  getScenarioSelectOptions,
  getScenarioSelectOption,
  checkScenarioSelectValue,
  clearScenarioSelect,
  setScenarioSelect,
  getMultiSelectInput,
  getMultiSelectOptions,
  getMultiSelectOption,
  checkMultiSelectInputFieldValue,
  checkMultiSelectOptionValue,
  toggleInMultiSelect,
  getDateInput,
  checkDateValue,
  checkDateFieldIsEmpty,
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
