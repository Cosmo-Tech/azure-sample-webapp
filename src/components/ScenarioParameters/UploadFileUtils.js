// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import fileDownload from 'js-file-download';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { ORGANISATION_ID } from '../../configs/App.config';
import { STORAGE_ROOT_DIR_PLACEHOLDER } from './UploadFileConfig';
import DatasetService from '../../services/dataset/DatasetService';
import WorkspaceService from '../../services/workspace/WorkspaceService';
import { FileUpload } from './components/tabs';

// Build file location in Azure Storage
function buildStorageFilePath (scenarioId, parameterId, fileName) {
  return scenarioId + '/' + parameterId + '/' + fileName;
}

// Generate file name based on dataset information
function buildFileNameFromDataset (dataset, storageFilePath) {
  const fileName = dataset?.connector?.parametersValues
    .AZURE_STORAGE_CONTAINER_BLOB_PREFIX.split('/').pop();
  return storageFilePath + fileName;
}

// Update AZURE_STORAGE_CONTAINER_BLOB_PREFIX in a dataset reference
function updatePathInDatasetRef (dataset, storageFilePath) {
  dataset.current.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX = storageFilePath;
}

function createConnector (connectorId, storageFilePath) {
  return {
    id: connectorId,
    parametersValues: {
      AZURE_STORAGE_CONTAINER_BLOB_PREFIX: `${STORAGE_ROOT_DIR_PLACEHOLDER}/${storageFilePath}`
    }
  };
}

async function updateDatasetPartFile (dataset, datasetFile, setDatasetFile,
  datasetId, setDatasetId, parameterId, connectorId, scenarioId, workspaceId) {
  const storageFilePath = buildStorageFilePath(scenarioId, parameterId, datasetFile.name);
  if (datasetFile.status === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
    await updateFileWithUpload(datasetFile, setDatasetFile, dataset, datasetId,
      parameterId, connectorId, scenarioId, workspaceId, storageFilePath);
  } else if (datasetFile.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE) {
    await updateFileWithDelete(datasetFile, setDatasetFile, dataset, datasetId,
      setDatasetId, workspaceId, storageFilePath);
  }
}

async function updateFileWithUpload (datasetFile, setDatasetFile, dataset,
  datasetId, parameterId, connectorId, scenarioId, workspaceId, newStorageFilePath) {
  if (dataset.current && Object.keys(dataset.current).length !== 0) {
    const previousStorageFilePath = buildStorageFilePath(
      scenarioId, parameterId, datasetFile.initialName);
    // Delete existing file
    await deleteFile(previousStorageFilePath, datasetFile, setDatasetFile, workspaceId);
    // File has been marked to be uploaded
    await uploadFile(dataset, datasetFile, setDatasetFile, workspaceId, newStorageFilePath);
    // FIXME: missing workspace prefix ?
    updatePathInDatasetRef(dataset, newStorageFilePath);
    const {
      error,
      data
    } = await DatasetService.updateDataset(ORGANISATION_ID, datasetId, dataset.current);
    if (error) {
      console.error(error);
    } else {
      dataset.current = data;
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
    }
  } else {
    // File has been marked to be uploaded
    await uploadFile(dataset.current, datasetFile, setDatasetFile, workspaceId,
      newStorageFilePath);
    // Create new dataset
    const { error, data } = await DatasetService.createDataset(
      ORGANISATION_ID, datasetFile.parameterId, datasetFile.description,
      createConnector(connectorId, newStorageFilePath));
    if (error) {
      console.error(error);
    } else {
      dataset.current = data;
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
    }
  }
}

async function updateFileWithDelete (datasetFile, setDatasetFile, dataset,
  datasetId, setDatasetId, workspaceId, storageFilePath) {
  // File has been marked to be deleted
  await deleteFile(storageFilePath, datasetFile, setDatasetFile, workspaceId);
  const { error } = await DatasetService.deleteDataset(ORGANISATION_ID, datasetId);
  if (error) {
    console.error(error);
  } else {
    dataset.current = {};
    setDatasetFile({ ...datasetFile, file: null, name: '', status: UPLOAD_FILE_STATUS_KEY.EMPTY });
    setDatasetId('');
  }
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

const uploadFile = async (dataset, datasetFile, setDatasetFile, workspaceId, storageFilePath) => {
  setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.UPLOADING });
  const overwrite = true;
  const { error, data } = await WorkspaceService.uploadWorkspaceFile(
    ORGANISATION_ID, workspaceId, datasetFile.file, overwrite, storageFilePath);
  if (error) {
    console.error(error);
  } else {
    // Handle unlikely case where currentDataset.current is null or undefined
    // which is most likely to require a manual clean on the backend.
    if (!dataset.current) {
      console.warn('Your previous file was in an awkward state. The backend may not be clean.');
    } else if (Object.keys(dataset.current).length !== 0) {
      updatePathInDatasetRef(dataset, STORAGE_ROOT_DIR_PLACEHOLDER + '/' + data.fileName);
    }
    setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
  }
};

const prepareToDeleteFile = (datasetFile, setDatasetFile) => {
  setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE });
};

const deleteFile = async (connectorFilePath, datasetFile, setDatasetFile, workspaceId) => {
  setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.DELETING });
  const { error } = await WorkspaceService.deleteWorkspaceFile(
    ORGANISATION_ID, workspaceId, connectorFilePath);
  if (error) {
    console.error(error);
  } else {
    setDatasetFile({ ...datasetFile, file: null, name: '', status: UPLOAD_FILE_STATUS_KEY.EMPTY });
  }
};

const downloadFile = async (dataset, datasetFile, setDatasetFile, scenarioId, parameterId, workspaceId) => {
  const storageFilePath = buildStorageFilePath(scenarioId, parameterId, datasetFile.name);
  setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.DOWNLOADING });
  const { error, data, response } = await WorkspaceService.downloadWorkspaceFile(
    ORGANISATION_ID, workspaceId, storageFilePath);
  if (error) {
    console.error(error);
  } else {
    console.log(response.type);
    console.log(response);
    const blob = new Blob([data], { type: response.type });
    fileDownload(blob, datasetFile.name);
  }
  setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
};

const constructFileUpload = (key, file, setFile, scenarioId, currentDataset,
  datasetId, parameterId, workspaceId, acceptedFileTypesToUpload, editMode) => {
  return (
    <FileUpload key={key}
                file={file}
                setFile={setFile}
                scenarioId={scenarioId}
                currentDataset={currentDataset}
                datasetId={datasetId}
                parameterId={parameterId}
                workspaceId={workspaceId}
                acceptedFileTypesToUpload={acceptedFileTypesToUpload}
                editMode={editMode}
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

export const UploadFileUtils = {
  buildFileNameFromDataset,
  downloadFile,
  prepareToDeleteFile,
  prepareToUpload,
  updateDatasetPartFile,
  constructFileUpload,
  resetUploadFile
};
