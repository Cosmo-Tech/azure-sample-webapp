// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { getAuthenticationHeaders } from '../services/ClientApi.js';
import { Api } from '../services/config/Api';
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

// Build dataset file location for workspace files
function buildDatasetLocation(datasetId, fileName) {
  return 'datasets/' + datasetId + '/' + fileName;
}

// Build dataset file location for workspace files
function getFileNameFromDatasetLocation(dataset) {
  const location = dataset.source?.location;
  const locationMatchPattern = String.raw`datasets/${dataset?.id}/(.*)`;
  const match = new RegExp(locationMatchPattern, 'g').exec(location);
  const fileName = match?.[1];
  return fileName ?? location;
}

// Retrieve dataset file location for workspace files
function getDatasetLocation(dataset) {
  return dataset?.source?.location;
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
    const headers = await getAuthenticationHeaders(true);
    headers['Content-Type'] = 'application/octet-stream';

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
  buildDatasetLocation,
  getDatasetLocation,
  getFileNameFromDatasetLocation,
  getAllChildrenDatasetsNames,
  uploadZipWithFetchApi,
};
