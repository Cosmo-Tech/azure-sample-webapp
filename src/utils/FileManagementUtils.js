// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { PathUtils } from '@cosmotech/core';
import { TABLE_DATA_STATUS, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { VALID_MIME_TYPES } from '../services/config/ApiConstants';
import DatasetService from '../services/dataset/DatasetService';
import WorkspaceService from '../services/workspace/WorkspaceService';
import applicationStore from '../state/Store.config';
import { setApplicationErrorMessage } from '../state/app/reducers';
import { ConfigUtils } from './ConfigUtils';
import { DatasetsUtils } from './DatasetsUtils';

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

const downloadFile = async (organizationId, workspaceId, datasetId, datasetPartId, setClientFileDescriptorStatus) => {
  try {
    setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.DOWNLOADING);
    await DatasetService.downloadDatasetPart(organizationId, workspaceId, datasetId, datasetPartId);
    setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
  } catch (error) {
    console.error(error);
    applicationStore.dispatch(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.dataset', "Dataset hasn't been downloaded."),
      })
    );
  }
};

const downloadFileData = async (organizationId, workspaceId, datasets, datasetId, setClientFileDescriptorStatuses) => {
  const dataset = _findDatasetInDatasetsList(datasets, datasetId);
  if (!dataset) {
    throw new Error(`Error finding dataset ${datasetId}`);
  }
  const datasetLocation = DatasetsUtils.getDatasetLocation(dataset);
  if (!datasetLocation) return;

  try {
    setClientFileDescriptorStatuses(UPLOAD_FILE_STATUS_KEY.DOWNLOADING, TABLE_DATA_STATUS.DOWNLOADING);
    const data = await WorkspaceService.downloadWorkspaceFileData(organizationId, workspaceId, datasetLocation);
    setClientFileDescriptorStatuses(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD, TABLE_DATA_STATUS.PARSING);
    return data;
  } catch (error) {
    console.error(error);
    applicationStore.dispatch(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.dataset', "Dataset hasn't been downloaded."),
      })
    );
  }
};

const _findDatasetInDatasetsList = (datasets, datasetId) => {
  return datasets?.find((dataset) => dataset.id === datasetId);
};

function buildClientFileDescriptorFromDataset(datasets, datasetId) {
  const dataset = _findDatasetInDatasetsList(datasets, datasetId);
  if (datasetId != null && dataset === undefined) {
    console.error(
      `Dataset Not Found: cannot find dataset "${datasetId}", some data might be missing. If the ` +
        'problem persists, please check if the dataset still exists and if you have the permissions to read it.'
    );
  }

  // DEPRECATED
  console.warn('File datasets are deprecated, use dataset parts instead');
  return {
    id: datasetId,
    name: dataset === undefined ? '' : DatasetsUtils.getFileNameFromDatasetLocation(dataset),
    file: null,
    serializedData: null,
    status: dataset === undefined ? UPLOAD_FILE_STATUS_KEY.EMPTY : UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
  };
}

export const FileManagementUtils = {
  downloadFile,
  downloadFileData,
  isFileFormatValid,
  prepareToUpload,
  buildClientFileDescriptorFromDataset,
};
