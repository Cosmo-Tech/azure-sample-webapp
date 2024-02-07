// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';
import { apiUtils as api } from '../../utils';

// Get the "browse" button from the provided parameterSelector and upload the file provided by filePath (path must be
// relative to the cypress "fixtures" folder)
function upload(fileParameterElement, filePath) {
  fileParameterElement.find(GENERIC_SELECTORS.genericComponents.uploadFile.browseButtonInput).attachFile(filePath);
}

function getBrowseButton(fileParameterElement) {
  return fileParameterElement.find(GENERIC_SELECTORS.genericComponents.uploadFile.browseButton, { timeout: 10000 });
}
function getDownloadButton(fileParameterElement) {
  return fileParameterElement.find(GENERIC_SELECTORS.genericComponents.uploadFile.fileName, { timeout: 10000 });
}

function getDeleteButton(fileParameterElement) {
  return fileParameterElement.find(GENERIC_SELECTORS.genericComponents.uploadFile.deleteButton);
}

function getFileName(fileParameterElement) {
  return fileParameterElement.find(GENERIC_SELECTORS.genericComponents.uploadFile.fileName, { timeout: 10000 });
}

function getErrorMessage(fileParameterElement) {
  return fileParameterElement.find(GENERIC_SELECTORS.genericComponents.uploadFile.errorMessage);
}

function download(fileParameterElement) {
  const aliases = [api.interceptGetDataset(), api.interceptDownloadWorkspaceFile()];
  getDownloadButton(fileParameterElement).click();
  api.waitAliases(aliases, { timeout: 60 * 1000 });
}

function _delete(fileParameterElement) {
  getDeleteButton(fileParameterElement).click();
}

export const FileParameters = {
  upload,
  getBrowseButton,
  getDownloadButton,
  getDeleteButton,
  getFileName,
  getErrorMessage,
  download,
  delete: _delete,
};
