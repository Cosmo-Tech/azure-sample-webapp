// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { ORGANISATION_ID, WORKSPACE_ID } from '../../configs/App.config';
import { STORAGE_ROOT_DIR_PLACEHOLDER } from './UploadFileConfig';
import DatasetService from '../../services/dataset/DatasetService';
import WorkspaceService from '../../services/workspace/WorkspaceService';
import { FileUpload } from './components/tabs';

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
  dataset.current.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX = storageFilePath;
}

function createConnector (connectorId, storageFilePath) {
  return {
    id: connectorId,
    parametersValues: {
      AZURE_STORAGE_CONTAINER_BLOB_PREFIX: `${STORAGE_ROOT_DIR_PLACEHOLDER}${storageFilePath}`
    }
  };
}

async function updateDatasetPartFile (dataset, datasetFile, setDatasetFile,
  datasetId, setDatasetId, parameterId, connectorId, scenarioId, workspaceId) {
  if (datasetFile.status === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
    await updateFileWithUpload(datasetFile, setDatasetFile, dataset, datasetId,
      parameterId, connectorId, scenarioId, workspaceId, datasetFile.name);
  } else if (datasetFile.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE) {
    await updateFileWithDelete(datasetFile, setDatasetFile, dataset, datasetId,
      setDatasetId);
  }
}

async function updateFileWithUpload (datasetFile, setDatasetFile, dataset,
  datasetId, parameterId, connectorId, scenarioId, workspaceId, fileName) {
  /*
       FIXME:  Due to parametersValues inheritance, the workspace file deletion leads
        to incoherent state when a dataset part file is uploaded.
        For the moment, the workspace file deletion in omitted. This will be fixed in next version
  */
  // Create new dataset
  const tags = ['dataset_part'];
  const { error: creationError, data: createdData } = await DatasetService.createDataset(
    ORGANISATION_ID, datasetFile.parameterId, datasetFile.description, { id: connectorId }, tags);

  if (creationError) {
    console.error(creationError);
  } else {
    const datasetId = createdData.id;

    const datasetTargetPath = buildStorageFilePath(datasetId, fileName);

    const connectorInfo = createConnector(connectorId, datasetTargetPath);
    createdData.connector = connectorInfo;

    const { error: updateError, data: updateData } = await DatasetService.updateDataset(
      ORGANISATION_ID, datasetId, createdData);

    if (updateError) {
      console.error(updateError);
    } else {
      dataset.current = updateData;
      // File has been marked to be uploaded
      await uploadFile(dataset, datasetFile, setDatasetFile, workspaceId, datasetTargetPath);
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
    }
  }
}

async function updateFileWithDelete (datasetFile, setDatasetFile, dataset,
  datasetId, setDatasetId) {
  /*
       FIXME:  Due to parametersValues inheritance, the workspace file deletion leads
        to incoherent state when a dataset part file is uploaded.
        For the moment, the workspace file deletion in omitted. This will be fixed in next version
  */
  dataset.current = {};
  setDatasetFile({ ...datasetFile, file: null, name: '', status: UPLOAD_FILE_STATUS_KEY.EMPTY });
  setDatasetId('');
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
      updatePathInDatasetRef(dataset, STORAGE_ROOT_DIR_PLACEHOLDER + data.fileName);
    }
    setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
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

const downloadFile = async (dataset, datasetFile, setDatasetFile) => {
  const datasetId = dataset.current.id;
  const { error, data } = await DatasetService.findDatasetById(ORGANISATION_ID, datasetId);
  if (error) {
    console.error(error);
    throw new Error(`Error finding dataset ${datasetId}`);
  } else {
    const storageFilePath = getStorageFilePathFromDataset(data);
    if (storageFilePath !== undefined) {
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.DOWNLOADING });
      await WorkspaceService.fetchWorkspaceFile(ORGANISATION_ID, WORKSPACE_ID, storageFilePath);
      setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
    }
  }
};

const constructFileUpload = (key, file, setFile, currentDataset, datasetId, acceptedFileTypesToUpload, editMode) => {
  return (
<FileUpload key={key}
          file={file}
          setFile={setFile}
          currentDataset={currentDataset}
          datasetId={datasetId}
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
