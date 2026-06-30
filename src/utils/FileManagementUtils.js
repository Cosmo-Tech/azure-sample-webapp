// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { PathUtils } from '@cosmotech/core';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { VALID_MIME_TYPES } from '../services/config/ApiConstants';
import { ConfigUtils } from './ConfigUtils';

function _forgeNameOfUploadedFile(file, parameterMetadata, defaultFileTypeFilter) {
  const shouldRenameFile = ConfigUtils.getParameterAttribute(parameterMetadata, 'shouldRenameFileOnUpload');
  if (!shouldRenameFile) return file?.name;
  if (!file.name) return parameterMetadata.id;

  const fileTypeFilter =
    ConfigUtils.getParameterAttribute(parameterMetadata, 'defaultFileTypeFilter') ?? defaultFileTypeFilter;
  const uploadedFileExtension = PathUtils.getExtensionFromFileName(file.name);
  const isFileExtensionAllowed =
    !fileTypeFilter || PathUtils.isExtensionInFileTypeFilter(uploadedFileExtension, fileTypeFilter);
  const outputFileExtension = isFileExtensionAllowed ? `.${uploadedFileExtension}` : '';
  const newFileName = `${parameterMetadata.id}${outputFileExtension}`;
  if (!isFileExtensionAllowed) {
    console.warn(
      `The extension of the uploaded file "${file.name}" is not allowed by file type filter "${fileTypeFilter}". ` +
        `File will be saved with the name "${newFileName}".`
    );
  }
  return newFileName;
}

const isFileFormatValid = (fileMIMEType) => {
  return VALID_MIME_TYPES.length === 0 || VALID_MIME_TYPES.includes(fileMIMEType);
};

// FIXME: split the "browser upload" part, the FileParameter creation (FileParameterUtils) and the state
// update (component)
const prepareToUpload = (event, setClientFileDescriptor, parameterData, options) => {
  const file = event.target.files[0];
  // Fix Chrome/Edge "cache" behaviour.
  // HTML input is not triggered when the same file is selected twice
  event.target.value = null;
  if (file == null) return;

  setClientFileDescriptor({
    name: _forgeNameOfUploadedFile(file, parameterData, options?.defaultFileTypeFilter),
    value: file,
    serializedData: null,
    status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
  });
  return file;
};

export const FileManagementUtils = {
  isFileFormatValid,
  prepareToUpload,
};
