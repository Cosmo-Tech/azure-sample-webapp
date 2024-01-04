// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { t } from 'i18next';
import { Auth } from '@cosmotech/core';
import {
  CONNECTOR_VERSION_AZURE_STORAGE,
  CONNECTOR_NAME_AZURE_STORAGE,
  CONNECTOR_NAME_ADT,
  STORAGE_ROOT_DIR_PLACEHOLDER,
} from '../services/config/ApiConstants';
import { Api } from '../services/config/Api';
import { dispatchSetApplicationErrorMessage } from '../state/dispatchers/app/ApplicationDispatcher';

// Build dataset file location in Azure Storage
function buildStorageFilePath(datasetId, fileName) {
  return 'datasets/' + datasetId + '/' + fileName;
}

// Retrieve dataset file location in Azure Storage
function getStorageFilePathFromDataset(dataset) {
  const blobPrefix = dataset?.connector?.parametersValues?.AZURE_STORAGE_CONTAINER_BLOB_PREFIX;
  if (blobPrefix !== undefined) {
    return blobPrefix.split(STORAGE_ROOT_DIR_PLACEHOLDER).pop();
  }
}

// Retrieve file name from dataset information
function getFileNameFromDataset(dataset) {
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
function buildAzureStorageConnector(connectorId, storageFilePath) {
  return {
    id: connectorId,
    name: CONNECTOR_NAME_AZURE_STORAGE,
    parametersValues: {
      AZURE_STORAGE_CONTAINER_BLOB_PREFIX: `${STORAGE_ROOT_DIR_PLACEHOLDER}${storageFilePath}`,
    },
    version: CONNECTOR_VERSION_AZURE_STORAGE,
  };
}

const getAllChildrenDatasetsNames = (initialDatasetId, datasets) => {
  if (!Array.isArray(datasets) || !datasets.some((dataset) => dataset.parentId === initialDatasetId)) return [];
  const childrenDatasets = datasets.filter((dataset) => dataset.parentId !== null);
  const datasetTree = [];
  const buildDatasetTree = (parentId) => {
    childrenDatasets.forEach((dataset) => {
      if (dataset.parentId === parentId) {
        datasetTree.push(dataset.name);
        buildDatasetTree(dataset.id);
      }
    });
  };
  buildDatasetTree(initialDatasetId);
  return datasetTree;
};

const removeUndefinedValuesBeforeCreatingDataset = (values) => {
  if (!values) return;
  Object.keys(values).forEach((field) => {
    if (values[field] === undefined) delete values[field];
    else if (typeof values[field] === 'object') {
      removeUndefinedValuesBeforeCreatingDataset(values[field]);
    }
  });
};

const uploadZipWithFetchApi = async (organizationId, datasetId, file) => {
  try {
    const tokens = await Auth.acquireTokens();
    const headers = {
      Authorization: 'Bearer ' + tokens.accessToken,
      'Content-Type': 'application/octet-stream',
    };
    return await fetch(`${Api.defaultBasePath}/organizations/${organizationId}/datasets/${datasetId}`, {
      method: 'POST',
      headers,
      body: file,
    });
  } catch (error) {
    console.error(error);
    dispatchSetApplicationErrorMessage(
      error,
      t('commoncomponents.banner.twingraphNotCreated', 'A problem occurred during twingraph creation or update')
    );
  }
};

export const DatasetsUtils = {
  buildStorageFilePath,
  getStorageFilePathFromDataset,
  getFileNameFromDataset,
  buildAzureStorageConnector,
  getAllChildrenDatasetsNames,
  removeUndefinedValuesBeforeCreatingDataset,
  uploadZipWithFetchApi,
};
