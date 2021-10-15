// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { SELECTORS } from '../../IdConstants';

// Get the "browse" button from the provided parameterSelector and upload the file provided by filePath (path must be
// relative to the cypress "fixtures" folder)
function upload(fileParameterElement, filePath) {
  fileParameterElement.find(SELECTORS.genericComponents.uploadFile.browseButtonInput).attachFile(filePath);
}

function getDownloadButton(fileParameterElement) {
  return fileParameterElement.find(SELECTORS.genericComponents.uploadFile.downloadButton);
}

function getDeleteButton(fileParameterElement) {
  return fileParameterElement.find(SELECTORS.genericComponents.uploadFile.deleteButton);
}

function download(fileParameterElement) {
  getDownloadButton(fileParameterElement).click();
}

function _delete(fileParameterElement) {
  getDeleteButton(fileParameterElement).click();
}

export const FileParameters = {
  upload,
  getDownloadButton,
  getDeleteButton,
  download,
  delete: _delete,
};
