// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { FileBlobUtils } from '@cosmotech/core';
import { Api } from '../../services/config/Api';
import { SecurityUtils } from '../../utils';

const findDatasetById = (organizationId, workspaceId, datasetId) => {
  return Api.Datasets.getDataset(organizationId, workspaceId, datasetId);
};

const createNoneTypeDataset = (organizationId, workspaceId, name, description, tags, main = false) => {
  const newDataset = { name, description, tags, main, additionalData: { webapp: { sourceType: 'None' } } };
  return Api.Datasets.createDataset(organizationId, workspaceId, newDataset);
};

const updateDataset = (organizationId, workspaceId, datasetId, dataset) => {
  return Api.Datasets.updateDataset(organizationId, workspaceId, datasetId, dataset);
};

const updateSecurity = async (organizationId, workspaceId, datasetId, currentSecurity, newSecurity) => {
  const setDefaultSecurity = async (newRole) =>
    Api.Datasets.updateDatasetDefaultSecurity(organizationId, workspaceId, datasetId, { role: newRole });
  const addAccess = async (newEntry) =>
    Api.Datasets.createDatasetAccessControl(organizationId, workspaceId, datasetId, newEntry);
  const updateAccess = async (userIdToUpdate, newRole) =>
    Api.Datasets.updateDatasetAccessControl(organizationId, workspaceId, datasetId, userIdToUpdate, { role: newRole });
  const removeAccess = async (userIdToRemove) =>
    Api.Datasets.deleteDatasetAccessControl(organizationId, workspaceId, datasetId, userIdToRemove);

  await SecurityUtils.updateResourceSecurity(
    currentSecurity,
    newSecurity,
    setDefaultSecurity,
    addAccess,
    updateAccess,
    removeAccess
  );
};

const deleteDataset = (organizationId, workspaceId, datasetId) => {
  return Api.Datasets.deleteDataset(organizationId, workspaceId, datasetId);
};

const createEmptyDataset = async (organizationId, workspaceId, dataset) => {
  const datasetWithoutParts = { ...dataset, parts: [] };
  const { data: emptyDataset } = await Api.Datasets.createDataset(organizationId, workspaceId, datasetWithoutParts);
  return emptyDataset;
};

const createDatasetPart = async (organizationId, workspaceId, datasetId, datasetPart, file) => {
  const { data } = await Api.Datasets.createDatasetPart(organizationId, workspaceId, datasetId, file, datasetPart);
  return data;
};

const deleteDatasetPart = async (organizationId, workspaceId, datasetId, datasetPartId) => {
  const { data } = await Api.Datasets.deleteDatasetPart(organizationId, workspaceId, datasetId, datasetPartId);
  return data;
};

const downloadDatasetPart = async (datasetPart) => {
  const { organizationId, workspaceId, datasetId, id, sourceName } = datasetPart;
  const { data, status } = await Api.Datasets.downloadDatasetPart(organizationId, workspaceId, datasetId, id);
  if (status !== 200) {
    throw new Error(`Error when downloading dataset part "${id}" in dataset "${datasetId}"`);
  }
  FileBlobUtils.downloadFileFromData(data, sourceName);
  return data;
};

const DatasetService = {
  findDatasetById,
  createNoneTypeDataset,
  updateDataset,
  updateSecurity,
  deleteDataset,
  createEmptyDataset,
  createDatasetPart,
  deleteDatasetPart,
  downloadDatasetPart,
};

export default DatasetService;
