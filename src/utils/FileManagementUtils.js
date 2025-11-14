// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { PathUtils } from '@cosmotech/core';
import { TABLE_DATA_STATUS, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { FILE_DATASET_PART_ID_VARTYPE, VALID_MIME_TYPES } from '../services/config/ApiConstants';
import DatasetService from '../services/dataset/DatasetService';
import WorkspaceService from '../services/workspace/WorkspaceService';
import applicationStore from '../state/Store.config';
import { setApplicationErrorMessage } from '../state/app/reducers';
import { ConfigUtils } from './ConfigUtils';
import { DatasetsUtils } from './DatasetsUtils';
import { SolutionsUtils } from './SolutionsUtils';

const serializeBeforeUpload = (clientFileDescriptor) => {
  if (!clientFileDescriptor?.serialize) return clientFileDescriptor.serializedData;
  return clientFileDescriptor.serialize(clientFileDescriptor);
};

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

// FIXME: Due to parametersValues inheritance, the workspace file deletion leads to incoherent state when a dataset
// part file is uploaded. For the moment, the workspace file deletion is omitted. This will be fixed in next version
async function _processFileDeletion(setClientFileDescriptorStatus) {
  setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.EMPTY);
  return null;
}

// This function will return the new object only when changes have been applied
async function _applyDatasetChange(
  organizationId,
  workspaceId,
  parameterMetadata,
  clientFileDescriptor,
  setClientFileDescriptorStatus,
  parameterValue,
  addDatasetToStore,
  scenarioSecurity
) {
  const fileStatus = clientFileDescriptor?.status;
  if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
    // Apply custom serialization function defined in clientFileDescriptor.serialize if required. This is used to
    // process the content of tables so it can be saved as CSV files
    if (clientFileDescriptor?.serialize != null) {
      setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.UPLOADING);
      const serializedData = serializeBeforeUpload(clientFileDescriptor);
      setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD);
      return { serializedData };
    }
  } else if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE) {
    // FIXME: the value returned is not the new object
    return await _processFileDeletion(setClientFileDescriptorStatus);
  } else if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD || fileStatus === UPLOAD_FILE_STATUS_KEY.EMPTY) {
    return;
  }
  console.warn(`Unknown file status "${fileStatus}"`);
}

// This function updates entries in parametersValuesRef if their varType is %DATASETID%, based on the status of the
// associated client file descriptor in parametersValuesToRender
async function applyPendingOperationsOnFileParameters(
  organizationId,
  workspaceId,
  solution,
  parametersMetadata,
  parametersValues,
  updateParameterValue,
  addDatasetToStore,
  scenarioSecurity
) {
  // Setter to update file descriptors status in the React component state
  const setClientFileDescriptorStatus = (parameterId, newStatus) => {
    updateParameterValue(parameterId, { status: newStatus });
  };

  // Apply pending operations on each dataset and keep track of the changes of datasets ids to patch parametersValuesRef
  for (const parameterId in parametersValues) {
    const varType = SolutionsUtils.getParameterVarType(solution, parameterId);
    if (varType === FILE_DATASET_PART_ID_VARTYPE) {
      try {
        const newParameterValue = await _applyDatasetChange(
          organizationId,
          workspaceId,
          parametersMetadata[parameterId],
          parametersValues[parameterId],
          (newStatus) => setClientFileDescriptorStatus(parameterId, newStatus),
          parametersValues[parameterId].id,
          addDatasetToStore,
          scenarioSecurity
        );

        if (newParameterValue != null) updateParameterValue(parameterId, newParameterValue);
      } catch (error) {
        console.error(error);
        setClientFileDescriptorStatus(parameterId, UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD);
        return error;
      }
    }
  }
}

const isFileFormatValid = (fileMIMEType) => {
  return VALID_MIME_TYPES.length === 0 || VALID_MIME_TYPES.includes(fileMIMEType);
};

const prepareToUpload = (event, setClientFileDescriptor, parameterData, options) => {
  const file = event.target.files[0];
  // Fix Chrome/Edge "cache" behaviour.
  // HTML input is not triggered when the same file is selected twice
  event.target.value = null;
  if (file == null) return;

  setClientFileDescriptor({
    name: _forgeNameOfUploadedFile(file, parameterData, options?.defaultFileTypeFilter),
    file,
    serializedData: null,
    status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
  });
  return file;
};

const prepareToDeleteFile = (setClientFileDescriptorStatus) => {
  setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE);
};

const downloadDatasetPartFile = async (datasetPart, setStatus) => {
  try {
    setStatus(UPLOAD_FILE_STATUS_KEY.DOWNLOADING);
    await DatasetService.downloadDatasetPart(datasetPart);
    setStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
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
  return {
    id: datasetId,
    name: dataset === undefined ? '' : DatasetsUtils.getFileNameFromDatasetLocation(dataset),
    file: null,
    serializedData: null,
    status: dataset === undefined ? UPLOAD_FILE_STATUS_KEY.EMPTY : UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
  };
}

export const FileManagementUtils = {
  downloadDatasetPartFile,
  downloadFile,
  downloadFileData,
  prepareToDeleteFile,
  isFileFormatValid,
  prepareToUpload,
  applyPendingOperationsOnFileParameters,
  buildClientFileDescriptorFromDataset,
};
