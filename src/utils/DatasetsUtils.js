// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { Auth } from '@cosmotech/core';
import { Api } from '../services/config/Api';
import {
  CONNECTOR_VERSION_AZURE_STORAGE,
  CONNECTOR_NAME_AZURE_STORAGE,
  CONNECTOR_NAME_ADT,
  STORAGE_ROOT_DIR_PLACEHOLDER,
} from '../services/config/ApiConstants';
import { ACL_ROLES } from '../services/config/accessControl';
import { dispatchSetApplicationErrorMessage } from '../state/dispatchers/app/ApplicationDispatcher';
import { SecurityUtils } from './SecurityUtils';

const patchDatasetWithCurrentUserPermissions = (dataset, userEmail, permissionsMapping) => {
  if (dataset == null) return;

  let userPermissions;
  if (dataset.security == null)
    userPermissions = SecurityUtils.getPermissionsFromRole(ACL_ROLES.DATASET.ADMIN, permissionsMapping);
  else userPermissions = SecurityUtils.getUserPermissionsForResource(dataset.security, userEmail, permissionsMapping);

  dataset.security = { ...dataset.security, currentUserPermissions: userPermissions };
};

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
  patchDatasetWithCurrentUserPermissions,
  buildStorageFilePath,
  getStorageFilePathFromDataset,
  getFileNameFromDataset,
  buildAzureStorageConnector,
  getAllChildrenDatasetsNames,
  uploadZipWithFetchApi,
};
