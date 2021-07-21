// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';

// Constants
export const STORAGE_ROOT_DIR_PLACEHOLDER = '%WORKSPACE_FILE%/';

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

const prepareToDeleteFile = (datasetFile, setDatasetFile) => {
  setDatasetFile({ ...datasetFile, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE });
};

function getStorageFilePathFromDataset (data) {
  const blobPrefix = data.connector?.parametersValues?.AZURE_STORAGE_CONTAINER_BLOB_PREFIX;
  if (blobPrefix !== undefined) {
    return blobPrefix.split(STORAGE_ROOT_DIR_PLACEHOLDER).pop();
  }
}

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
  getStorageFilePathFromDataset,
  prepareToDeleteFile,
  prepareToUpload,
  buildStorageFilePath,
  updatePathInDatasetRef,
  createConnector,
  updateFileWithDelete,
  resetUploadFile
};
