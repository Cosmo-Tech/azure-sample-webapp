// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { PathUtils } from '@cosmotech/core';
import { TABLE_DATA_STATUS, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { AppInsights } from '../services/AppInsights';
import { DATASET_ID_VARTYPE, VALID_MIME_TYPES } from '../services/config/ApiConstants';
import DatasetService from '../services/dataset/DatasetService';
import WorkspaceService from '../services/workspace/WorkspaceService';
import applicationStore from '../state/Store.config';
import { dispatchSetApplicationErrorMessage } from '../state/dispatchers/app/ApplicationDispatcher';
import { ConfigUtils } from './ConfigUtils';
import { DatasetsUtils } from './DatasetsUtils';
import { SecurityUtils } from './SecurityUtils';
import { ScenarioParametersUtils } from './scenarioParameters/ScenarioParametersUtils';

const appInsights = AppInsights.getInstance();
const _applyUploadPreprocessToContent = (clientFileDescriptor) => {
  if (clientFileDescriptor?.uploadPreprocess?.content) {
    return clientFileDescriptor.uploadPreprocess.content(clientFileDescriptor);
  }
  return clientFileDescriptor.content;
};

const _uploadDatasetAsWorkspaceFile = async (
  organizationId,
  workspaceId,
  dataset,
  clientFileDescriptor,
  datasetLocation
) => {
  const overwrite = true;

  if (clientFileDescriptor.file) {
    const { error, data } = await WorkspaceService.uploadWorkspaceFile(
      organizationId,
      workspaceId,
      clientFileDescriptor.file,
      overwrite,
      datasetLocation
    );
    if (error) {
      throw error;
    }
    return data;
  } else if (clientFileDescriptor.content || clientFileDescriptor?.uploadPreprocess?.content != null) {
    const fileContent = _applyUploadPreprocessToContent(clientFileDescriptor);
    const { error, data } = await WorkspaceService.uploadWorkspaceFileFromData(
      organizationId,
      workspaceId,
      fileContent,
      'text/csv',
      overwrite,
      datasetLocation
    );
    if (error) {
      throw error;
    }
    return data;
  }
  throw new Error('No data to upload. Data must be present in client file descriptor "file" or "content" properties.');
};

async function _createEmptyDataset(organizationId, parameterMetadata) {
  const name = parameterMetadata.id;
  const description = ConfigUtils.getParameterAttribute(parameterMetadata, 'description') ?? '';
  const tags = ['dataset_part'];
  const { error: creationError, data: createdDataset } = await DatasetService.createNoneTypeDataset(
    organizationId,
    name,
    description,
    tags
  );
  if (creationError) {
    throw creationError;
  }
  return createdDataset;
}

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

// Update location of dataset for workspace files
async function _updateDatasetLocation(organizationId, datasetLocation, dataset) {
  dataset.source = dataset.source ?? {};
  dataset.source.location = datasetLocation;
  const { error: updateError, data: updatedDataset } = await DatasetService.updateDataset(
    organizationId,
    dataset.id,
    dataset
  );
  if (updateError) {
    throw updateError;
  }
  return updatedDataset;
}

async function _processFileUpload(
  organizationId,
  workspaceId,
  parameterMetadata,
  clientFileDescriptor,
  setClientFileDescriptorStatus,
  addDatasetToStore,
  scenarioSecurity
) {
  setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.UPLOADING);
  const createdDataset = await _createEmptyDataset(organizationId, parameterMetadata);
  const datasetLocation = DatasetsUtils.buildDatasetLocation(createdDataset.id, clientFileDescriptor.name);
  const updatedDataset = await _updateDatasetLocation(organizationId, datasetLocation, createdDataset);

  const datasetSecurity = SecurityUtils.forgeDatasetSecurityFromScenarioSecurity(scenarioSecurity);
  await DatasetService.updateSecurity(organizationId, createdDataset.id, createdDataset.security, datasetSecurity);
  updatedDataset.security = datasetSecurity;

  addDatasetToStore(updatedDataset);
  await _uploadDatasetAsWorkspaceFile(
    organizationId,
    workspaceId,
    updatedDataset,
    clientFileDescriptor,
    datasetLocation
  );
  setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
  return updatedDataset.id;
}

// FIXME: Due to parametersValues inheritance, the workspace file deletion leads to incoherent state when a dataset
// part file is uploaded. For the moment, the workspace file deletion is omitted. This will be fixed in next version
async function _processFileDeletion(setClientFileDescriptorStatus) {
  setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.EMPTY);
  return null;
}

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
    return await _processFileUpload(
      organizationId,
      workspaceId,
      parameterMetadata,
      clientFileDescriptor,
      setClientFileDescriptorStatus,
      addDatasetToStore,
      scenarioSecurity
    );
  } else if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE) {
    return await _processFileDeletion(setClientFileDescriptorStatus);
  } else if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD || fileStatus === UPLOAD_FILE_STATUS_KEY.EMPTY) {
    return parameterValue;
  }
  console.warn(`Unknown file status "${fileStatus}"`);
  return parameterValue;
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
    updateParameterValue(parameterId, 'status', newStatus);
  };

  const setDatasetId = (parameterId, newDatasetId) => {
    updateParameterValue(parameterId, 'id', newDatasetId);
  };

  // Apply pending operations on each dataset and keep track of the changes of datasets ids to patch parametersValuesRef

  for (const parameterId in parametersValues) {
    const varType = ScenarioParametersUtils.getParameterVarType(solution, parameterId);
    if (varType === DATASET_ID_VARTYPE) {
      try {
        const newDatasetId = await _applyDatasetChange(
          organizationId,
          workspaceId,
          parametersMetadata[parameterId],
          parametersValues[parameterId],
          (newStatus) => setClientFileDescriptorStatus(parameterId, newStatus),
          parametersValues[parameterId].id,
          addDatasetToStore,
          scenarioSecurity
        );
        setDatasetId(parameterId, newDatasetId);
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

  appInsights.trackUpload();
  setClientFileDescriptor({
    name: _forgeNameOfUploadedFile(file, parameterData, options?.defaultFileTypeFilter),
    file,
    content: null,
    status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD,
  });
  return file;
};

const prepareToDeleteFile = (setClientFileDescriptorStatus) => {
  setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE);
};

const downloadFile = async (organizationId, workspaceId, datasetId, setClientFileDescriptorStatus) => {
  try {
    const { data } = await DatasetService.findDatasetById(organizationId, datasetId);
    const datasetLocation = DatasetsUtils.getDatasetLocation(data);
    if (datasetLocation !== undefined) {
      setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.DOWNLOADING);
      await WorkspaceService.downloadWorkspaceFile(organizationId, workspaceId, datasetLocation);
      setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
    }
    appInsights.trackDownload();
  } catch (error) {
    console.error(error);
    applicationStore.dispatch(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.dataset', "Dataset hasn't been downloaded."))
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
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.dataset', "Dataset hasn't been downloaded."))
    );
  }
};

const _findDatasetInDatasetsList = (datasets, datasetId) => {
  return datasets?.find((dataset) => dataset.id === datasetId);
};

function buildClientFileDescriptorFromDataset(datasets, datasetId) {
  const dataset = _findDatasetInDatasetsList(datasets, datasetId);
  return {
    id: datasetId,
    name: dataset === undefined ? '' : DatasetsUtils.getFileNameFromDatasetLocation(dataset),
    file: null,
    content: null,
    status: dataset === undefined ? UPLOAD_FILE_STATUS_KEY.EMPTY : UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
  };
}

export const FileManagementUtils = {
  downloadFile,
  downloadFileData,
  prepareToDeleteFile,
  isFileFormatValid,
  prepareToUpload,
  applyPendingOperationsOnFileParameters,
  buildClientFileDescriptorFromDataset,
};
