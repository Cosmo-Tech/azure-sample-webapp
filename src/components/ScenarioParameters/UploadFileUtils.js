// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import {
  ORGANIZATION_ID, WORKSPACE_ID,
  ENABLE_APPLICATION_INSIGHTS
} from '../../config/AppInstance';
import DatasetService from '../../services/dataset/DatasetService';
import WorkspaceService from '../../services/workspace/WorkspaceService';
import { FileUpload } from './components/tabs';
import { AppInsights } from '../../services/AppInsights';

export const STORAGE_ROOT_DIR_PLACEHOLDER = '%WORKSPACE_FILE%/';

// App Insigths
const appInsights =
  ENABLE_APPLICATION_INSIGHTS
    ? AppInsights.getInstance()
    : undefined;

// Track upload
const trackUpload = (scenarioId) => {
  if (appInsights) {
    appInsights.trackEvent({ name: 'UploadFile' }, { name: scenarioId });
    appInsights.trackMetric({ name: 'UploadFileValue', average: 1, sampleCount: 1 });
  }
};
  // Track download
const trackDownload = (scenarioId) => {
  if (appInsights) {
    appInsights.trackEvent({ name: 'DownloadFile' }, { scenarioId: scenarioId });
    appInsights.trackMetric({ name: 'DownloadFileValue', average: 1, sampleCount: 1 });
  }
};

// Build dataset file location in Azure Storage
function buildStorageFilePath (datasetId, fileName) {
  return 'datasets/' + datasetId + '/' + fileName;
}

// Generate file name based on dataset information
function buildFileNameFromDataset (dataset, storageFilePath) {
  const fileName = dataset?.connector?.parametersValues
    .AZURE_STORAGE_CONTAINER_BLOB_PREFIX.split('/').pop();
  return storageFilePath + fileName;
}

// Update AZURE_STORAGE_CONTAINER_BLOB_PREFIX in a dataset reference
function updatePathInDatasetRef (dataset, storageFilePath) {
  dataset.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX = storageFilePath;
}

function createConnector (connectorId, storageFilePath) {
  return {
    id: connectorId,
    parametersValues: {
      AZURE_STORAGE_CONTAINER_BLOB_PREFIX: `${STORAGE_ROOT_DIR_PLACEHOLDER}${storageFilePath}`
    }
  };
}

async function updateDatasetPartFile (dataset, setDataset, datasetFile, setDatasetFile,
  datasetId, setDatasetId, parameterId, connectorId, scenarioId, workspaceId) {
  if (datasetFile.status === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
    return await updateFileWithUpload(datasetFile, setDatasetFile, dataset, setDataset, datasetId,
      parameterId, connectorId, scenarioId, workspaceId, datasetFile.name);
  } else if (datasetFile.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE) {
    return await updateFileWithDelete(datasetFile, setDatasetFile, dataset, setDataset, datasetId,
      setDatasetId);
  } else if (datasetFile.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD) {
    return dataset;
  }
}

async function updateFileWithUpload (datasetFile, setDatasetFile, dataset, setDataset,
  datasetId, parameterId, connectorId, scenarioId, workspaceId, fileName) {
  /*
       FIXME:  Due to parametersValues inheritance, the workspace file deletion leads
        to incoherent state when a dataset part file is uploaded.
        For the moment, the workspace file deletion in omitted. This will be fixed in next version
  */
  // Create new dataset
  const tags = ['dataset_part'];
  const { error: creationError, data: createdData } = await DatasetService.createDataset(
    ORGANIZATION_ID, datasetFile.parameterId, datasetFile.description, { id: connectorId }, tags);

  if (creationError) {
    console.error(creationError);
  } else {
    const datasetId = createdData.id;

    const datasetTargetPath = buildStorageFilePath(datasetId, fileName);

    const connectorInfo = createConnector(connectorId, datasetTargetPath);
    createdData.connector = connectorInfo;

    const { error: updateError, data: updateData } = await DatasetService.updateDataset(
      ORGANIZATION_ID, datasetId, createdData);

    if (updateError) {
      console.error(updateError);
      return {};
    } else {
      setDataset(updateData);
      // File has been marked to be uploaded
      await uploadFile(dataset, datasetFile, setDatasetFile, workspaceId, datasetTargetPath, scenarioId);
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
      return updateData;
    }
  }
}

async function updateFileWithDelete (datasetFile, setDatasetFile, dataset, setDataset,
  datasetId, setDatasetId) {
  /*
       FIXME:  Due to parametersValues inheritance, the workspace file deletion leads
        to incoherent state when a dataset part file is uploaded.
        For the moment, the workspace file deletion in omitted. This will be fixed in next version
  */
  setDataset({});
  setDatasetFile({ ...datasetFile, file: null, name: '', status: UPLOAD_FILE_STATUS_KEY.EMPTY });
  setDatasetId('');
  return {};
}

const prepareToUpload = (event, datasetFile, setDatasetFile) => {
  const file = event.target.files[0];
  if (file === undefined) {
    return;
  }
  setDatasetFile({
    ...datasetFile,
    file: file,
    name: file.name,
    status: UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD
  });
};

const uploadFile = async (
  dataset, datasetFile, setDatasetFile, workspaceId, storageFilePath, scenarioId
) => {
  const previousState = datasetFile.status;
  try {
    setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.UPLOADING });
    const overwrite = true;
    const { data } = await WorkspaceService.uploadWorkspaceFile(
      ORGANIZATION_ID, workspaceId, datasetFile.file, overwrite, storageFilePath);
    // Handle unlikely case where currentDataset is null or undefined
    // which is most likely to require a manual clean on the backend.
    if (!dataset) {
      console.warn('Your previous file was in an awkward state. The backend may not be clean.');
    } else if (Object.keys(dataset).length !== 0) {
      updatePathInDatasetRef(dataset, STORAGE_ROOT_DIR_PLACEHOLDER + data.fileName);
    }
    setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
    trackUpload(scenarioId);
  } catch (e) {
    console.error(e);
    setDatasetFile({ ...datasetFile, status: previousState });
  }
};

const prepareToDeleteFile = (datasetFile, setDatasetFile) => {
  setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE });
};

function getStorageFilePathFromDataset (data) {
  const blobPrefix = data.connector?.parametersValues?.AZURE_STORAGE_CONTAINER_BLOB_PREFIX;
  if (blobPrefix !== undefined) {
    return blobPrefix.split(STORAGE_ROOT_DIR_PLACEHOLDER).pop();
  }
}

const downloadFile = async (datasetId, datasetFile, setDatasetFile, scenarioId) => {
  const { error, data } = await DatasetService.findDatasetById(ORGANIZATION_ID, datasetId);
  if (error) {
    console.error(error);
    throw new Error(`Error finding dataset ${datasetId}`);
  } else {
    const storageFilePath = getStorageFilePathFromDataset(data);
    if (storageFilePath !== undefined) {
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.DOWNLOADING });
      await WorkspaceService.downloadWorkspaceFile(ORGANIZATION_ID, WORKSPACE_ID, storageFilePath);
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
    }
    trackDownload(scenarioId);
  }
};

const constructFileUpload = (
  keyValue, file, setFile, datasetId, acceptedFileTypesToUpload, editMode, scenarioId
) => {
  return (
<FileUpload keyValue={keyValue}
          file={file}
          setFile={setFile}
          datasetId={datasetId}
          acceptedFileTypesToUpload={acceptedFileTypesToUpload}
          editMode={editMode}
          scenarioId={scenarioId}
/>);
};

const resetUploadFile = (datasetId, file, setFile) => {
  const initialName = file.initialName;
  if (file.initialName !== '') {
    setFile({ ...file, name: initialName, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
  } else {
    setFile({ ...file, status: UPLOAD_FILE_STATUS_KEY.EMPTY });
  }
};

function updateDatasetState (datasetId, file, fetchDataset, dataset, setDataset, setFile) {
  if (datasetId !== '' &&
      (file.status === UPLOAD_FILE_STATUS_KEY.EMPTY ||
          file.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD)) {
    fetchDataset()
      .then((data) => {
        setDataset(data);
        const fileName = UploadFileUtils.buildFileNameFromDataset(data, '');
        setFile({
          ...file,
          initialName: fileName,
          name: fileName,
          status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD
        });
      })
      .catch((error) => {
        console.error(error);
        setDataset({});
        setFile({ ...file, name: '', status: UPLOAD_FILE_STATUS_KEY.EMPTY });
      });
  } else if (datasetId === '' &&
      file.status !== UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
    setDataset({});
    setFile({
      ...file,
      file: null,
      initialName: '',
      name: '',
      status: UPLOAD_FILE_STATUS_KEY.EMPTY
    });
  }
}

export const UploadFileUtils = {
  buildFileNameFromDataset,
  downloadFile,
  prepareToDeleteFile,
  prepareToUpload,
  updateDatasetPartFile,
  constructFileUpload,
  resetUploadFile,
  updateDatasetState
};
