// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Api } from '../../services/config/Api';
import { SecurityUtils } from '../../utils';

const findDatasetById = (organizationId, workspaceId, datasetId) => {
  return Api.Datasets.getDataset(organizationId, workspaceId, datasetId);
};

const createNoneTypeDataset = (organizationId, workspaceId, name, description, tags, main = false) => {
  const newDataset = { name, description, tags, main, sourceType: 'None' };
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

const DatasetService = {
  findDatasetById,
  createNoneTypeDataset,
  updateDataset,
  updateSecurity,
  deleteDataset,
};

export default DatasetService;
