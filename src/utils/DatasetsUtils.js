// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  CONNECTOR_VERSION_AZURE_STORAGE,
  CONNECTOR_NAME_AZURE_STORAGE,
  CONNECTOR_NAME_ADT,
  STORAGE_ROOT_DIR_PLACEHOLDER
} from '../services/config/ApiConstants';

// Build dataset file location in Azure Storage
function buildStorageFilePath (datasetId, fileName) {
  return 'datasets/' + datasetId + '/' + fileName;
}

// Retrieve dataset file location in Azure Storage
function getStorageFilePathFromDataset (dataset) {
  const blobPrefix = dataset?.connector?.parametersValues?.AZURE_STORAGE_CONTAINER_BLOB_PREFIX;
  if (blobPrefix !== undefined) {
    return blobPrefix.split(STORAGE_ROOT_DIR_PLACEHOLDER).pop();
  }
}

// Retrieve file name from dataset information
function getFileNameFromDataset (dataset) {
  const connectorName = dataset?.connector?.name;
  if (connectorName === CONNECTOR_NAME_AZURE_STORAGE) {
    return dataset?.connector?.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX.split('/').pop();
  } else if (connectorName === CONNECTOR_NAME_ADT) {
    return dataset?.name;
  }
  console.warn(`Unknown dataset connector type "${connectorName}"`);
  return '';
}

// Create a connector object for Azure Storage with the provided id and storage file path
function buildAzureStorageConnector (connectorId, storageFilePath) {
  return {
    id: connectorId,
    name: CONNECTOR_NAME_AZURE_STORAGE,
    parametersValues: {
      AZURE_STORAGE_CONTAINER_BLOB_PREFIX: `${STORAGE_ROOT_DIR_PLACEHOLDER}${storageFilePath}`
    },
    version: CONNECTOR_VERSION_AZURE_STORAGE
  };
}

export const DatasetsUtils = {
  buildStorageFilePath,
  getStorageFilePathFromDataset,
  getFileNameFromDataset,
  buildAzureStorageConnector
};
