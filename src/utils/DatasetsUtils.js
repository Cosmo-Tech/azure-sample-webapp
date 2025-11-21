// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { getAuthenticationHeaders } from '../services/ClientApi.js';
import { Api } from '../services/config/Api';
import { ACL_ROLES } from '../services/config/accessControl';
import { setApplicationErrorMessage } from '../state/app/reducers';
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
  // FIXME: remove function when it's no longer used
  console.log('Warning: this function is deprecated');
  const location = dataset.source?.location;
  const locationMatchPattern = String.raw`datasets/${dataset?.id}/(.*)`;
  const match = new RegExp(locationMatchPattern, 'g').exec(location);
  const fileName = match?.[1];
  return fileName ?? location;
}

// Retrieve dataset file location for workspace files
function getDatasetLocation(dataset) {
  // FIXME: remove function when it's no longer used
  console.log('Warning: this function is deprecated');
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

const uploadZipWithFetchApi = async (organizationId, workspaceId, datasetId, file) => {
  try {
    const headers = await getAuthenticationHeaders(true);
    headers['Content-Type'] = 'application/octet-stream';

    return await fetch(
      `${Api.defaultBasePath}/organizations/${organizationId}/workspaces/${workspaceId}/datasets/${datasetId}`,
      {
        method: 'POST',
        headers,
        body: file,
      }
    );
  } catch (error) {
    console.error(error);
    setApplicationErrorMessage({
      error,
      errorMessage: t(
        'commoncomponents.banner.twingraphNotCreated',
        'A problem occurred during twingraph creation or update'
      ),
    });
  }
};

const getDatasetOptions = (dataset) => dataset?.additionalData?.webapp;
const getDatasetOption = (dataset, optionKey) => dataset?.additionalData?.webapp?.[optionKey];

const setDatasetOptions = (dataset, options) => {
  if (!dataset) return;
  if (!dataset.additionalData) dataset.additionalData = { webapp: { ...options } };
  else if (!dataset.additionalData.webapp) dataset.additionalData.webapp = { ...options };
  else dataset.additionalData.webapp = { ...dataset.additionalData.webapp, ...options };
};

const isVisibleInDatasetManager = (dataset) => getDatasetOptions(dataset)?.visible?.datasetManager === true;

// TODO: add check on dataset status if created by an ETL script
const isVisibleInScenarioCreation = (dataset) => getDatasetOptions(dataset)?.visible?.scenarioCreation === true;

export const DatasetsUtils = {
  patchDatasetWithCurrentUserPermissions,
  buildDatasetLocation,
  getDatasetLocation,
  getFileNameFromDatasetLocation,
  getAllChildrenDatasetsNames,
  uploadZipWithFetchApi,
  getDatasetOptions,
  getDatasetOption,
  setDatasetOptions,
  isVisibleInDatasetManager,
  isVisibleInScenarioCreation,
};
