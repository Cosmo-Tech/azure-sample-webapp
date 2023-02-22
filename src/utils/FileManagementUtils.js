// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { TABLE_DATA_STATUS, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import DatasetService from '../services/dataset/DatasetService';
import WorkspaceService from '../services/workspace/WorkspaceService';
import { AppInsights } from '../services/AppInsights';
import { DATASET_ID_VARTYPE } from '../services/config/ApiConstants';
import { ConfigUtils, DatasetsUtils, ScenarioParametersUtils } from '.';
import applicationStore from '../state/Store.config';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../state/dispatchers/app/ApplicationDispatcher';

const appInsights = AppInsights.getInstance();
const _applyUploadPreprocessToContent = (clientFileDescriptor) => {
  if (clientFileDescriptor?.uploadPreprocess?.content) {
    return clientFileDescriptor.uploadPreprocess.content(clientFileDescriptor);
  }
  return clientFileDescriptor.content;
};

const _uploadFileToCloudStorage = async (
  organizationId,
  workspaceId,
  dataset,
  clientFileDescriptor,
  storageFilePath
) => {
  const overwrite = true;

  if (clientFileDescriptor.file) {
    const { error, data } = await WorkspaceService.uploadWorkspaceFile(
      organizationId,
      workspaceId,
      clientFileDescriptor.file,
      overwrite,
      storageFilePath
    );
    if (error) {
      throw error;
    }
    return data;
  } else if (clientFileDescriptor.content) {
    const fileContent = _applyUploadPreprocessToContent(clientFileDescriptor);
    const { error, data } = await WorkspaceService.uploadWorkspaceFileFromData(
      organizationId,
      workspaceId,
      fileContent,
      'text/csv',
      overwrite,
      storageFilePath
    );
    if (error) {
      throw error;
    }
    return data;
  }
  throw new Error('No data to upload. Data must be present in client file descriptor "file" or "content" properties.');
};

async function _createEmptyDatasetInCloudStorage(organizationId, parameterMetadata) {
  const connectorId = ConfigUtils.getParameterAttribute(parameterMetadata, 'connectorId');
  if (!connectorId) {
    throw new Error(`Missing connector id in configuration file for scenario parameter ${parameterMetadata.id}`);
  }
  const name = parameterMetadata.id;
  const description = ConfigUtils.getParameterAttribute(parameterMetadata, 'description') ?? '';
  const connector = { id: connectorId };
  const tags = ['dataset_part'];
  const { error: creationError, data: createdDataset } = await DatasetService.createDataset(
    organizationId,
    name,
    description,
    connector,
    tags
  );
  if (creationError) {
    throw creationError;
  }
  return createdDataset;
}

function _buildStorageFilePath(dataset, clientFileDescriptor) {
  const datasetId = dataset.id;
  const fileName = clientFileDescriptor.name;
  return DatasetsUtils.buildStorageFilePath(datasetId, fileName);
}

// Update created dataset with connector data (including file path in Azure Storage, based on dataset id)
async function _updateDatasetWithConnectorDataInCloudStorage(
  organizationId,
  parameterMetadata,
  storageFilePath,
  dataset
) {
  const connectorId = ConfigUtils.getParameterAttribute(parameterMetadata, 'connectorId');
  dataset.connector = DatasetsUtils.buildAzureStorageConnector(connectorId, storageFilePath);
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
  addDatasetToStore
) {
  try {
    setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.UPLOADING);
    const createdDataset = await _createEmptyDatasetInCloudStorage(organizationId, parameterMetadata);
    const storageFilePath = _buildStorageFilePath(createdDataset, clientFileDescriptor);
    const updatedDataset = await _updateDatasetWithConnectorDataInCloudStorage(
      organizationId,
      parameterMetadata,
      storageFilePath,
      createdDataset
    );
    addDatasetToStore(updatedDataset);
    await _uploadFileToCloudStorage(organizationId, workspaceId, updatedDataset, clientFileDescriptor, storageFilePath);
    setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
    return updatedDataset.id;
  } catch (error) {
    console.error(error);
    applicationStore.dispatch(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'commoncomponents.banner.incompleteRun',
          // eslint-disable-next-line max-len
          "A problem occurred during dataset update; the scenario is running but your new parameters haven't been saved."
        )
      )
    );
    setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.EMPTY);
    return null;
  }
}

// FIXME: Due to parametersValues inheritance, the workspace file deletion leads to incoherent state when a dataset
// part file is uploaded. For the moment, the workspace file deletion is omitted. This will be fixed in next version
async function _processFileDeletion() {
  return null;
}

async function _applyDatasetChange(
  organizationId,
  workspaceId,
  parameterMetadata,
  clientFileDescriptor,
  setClientFileDescriptorStatus,
  parameterValue,
  addDatasetToStore
) {
  const fileStatus = clientFileDescriptor?.status;
  if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
    return await _processFileUpload(
      organizationId,
      workspaceId,
      parameterMetadata,
      clientFileDescriptor,
      setClientFileDescriptorStatus,
      addDatasetToStore
    );
  } else if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE) {
    return await _processFileDeletion();
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
  addDatasetToStore
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
      const newDatasetId = await _applyDatasetChange(
        organizationId,
        workspaceId,
        parametersMetadata[parameterId],
        parametersValues[parameterId],
        (newStatus) => setClientFileDescriptorStatus(parameterId, newStatus),
        parametersValues[parameterId].id,
        addDatasetToStore
      );
      setDatasetId(parameterId, newDatasetId);
    }
  }
}

const prepareToUpload = (event, clientFileDescriptor, setClientFileDescriptor) => {
  const file = event.target.files[0];
  // Fix Chrome/Edge "cache" behaviour.
  // HTML input is not triggered when the same file is selected twice
  event.target.value = null;
  if (file === undefined) {
    return;
  }
  appInsights.trackUpload();
  setClientFileDescriptor({
    name: file.name,
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
    const storageFilePath = DatasetsUtils.getStorageFilePathFromDataset(data);
    if (storageFilePath !== undefined) {
      setClientFileDescriptorStatus(UPLOAD_FILE_STATUS_KEY.DOWNLOADING);
      await WorkspaceService.downloadWorkspaceFile(organizationId, workspaceId, storageFilePath);
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
  const storageFilePath = DatasetsUtils.getStorageFilePathFromDataset(dataset);
  if (!storageFilePath) {
    return;
  }
  try {
    setClientFileDescriptorStatuses(UPLOAD_FILE_STATUS_KEY.DOWNLOADING, TABLE_DATA_STATUS.DOWNLOADING);
    const data = await WorkspaceService.downloadWorkspaceFileData(organizationId, workspaceId, storageFilePath);
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
  if (dataset === undefined) {
    return {
      id: datasetId,
      name: '',
      file: null,
      content: null,
      status: UPLOAD_FILE_STATUS_KEY.EMPTY,
    };
  }
  return {
    id: datasetId,
    name: DatasetsUtils.getFileNameFromDataset(dataset),
    file: null,
    content: null,
    status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD,
  };
}

export const FileManagementUtils = {
  downloadFile,
  downloadFileData,
  prepareToDeleteFile,
  prepareToUpload,
  applyPendingOperationsOnFileParameters,
  buildClientFileDescriptorFromDataset,
};
