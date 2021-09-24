// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const CONNECTOR_NAME_AZURE_STORAGE = 'Azure Storage Connector';
const CONNECTOR_NAME_ADT = 'ADT Connector';

export const STORAGE_ROOT_DIR = '%WORKSPACE_FILE%/';

// Build dataset file location in Azure Storage
function buildStorageFilePath (datasetId, fileName) {
  return 'datasets/' + datasetId + '/' + fileName;
}

// Retrieve dataset file location in Azure Storage
function getStorageFilePathFromDataset (dataset) {
  const blobPrefix = dataset?.connector?.parametersValues?.AZURE_STORAGE_CONTAINER_BLOB_PREFIX;
  if (blobPrefix !== undefined) {
    return blobPrefix.split(STORAGE_ROOT_DIR).pop();
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

// Update AZURE_STORAGE_CONTAINER_BLOB_PREFIX property in the connector of the provided dataset
function setFilePathInDataset (dataset, storageFilePath) {
  // TODO: file path or blob prefix ?
  dataset.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX = `${STORAGE_ROOT_DIR}${storageFilePath}`;
}

// Create a connector object for Azure Storage with the provided id and storage file path
function createAzureStorageConnector (connectorId, storageFilePath) {
  return {
    id: connectorId,
    name: 'Azure Storage Connector',
    parametersValues: {
      AZURE_STORAGE_CONTAINER_BLOB_PREFIX: `${STORAGE_ROOT_DIR}${storageFilePath}`
    },
    version: '1.0.3'
  };
}

export const DatasetsUtils = {
  buildStorageFilePath,
  getStorageFilePathFromDataset,
  getFileNameFromDataset,
  setFilePathInDataset,
  createAzureStorageConnector
};
