// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { GENERIC_SELECTORS } from '../../constants/generic/IdConstants';

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

function download(fileParameterElement) {
  getDownloadButton(fileParameterElement).click();
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
  download,
  delete: _delete,
};
