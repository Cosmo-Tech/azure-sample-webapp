// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Api } from '../../services/config/Api';
import { SecurityUtils } from '../../utils';

const findDatasetById = (organizationId, datasetId) => {
  return Api.Datasets.findDatasetById(organizationId, datasetId);
};

const createDataset = (organizationId, name, description, connector, tags, main = false) => {
  const newDataset = { name, description, connector, tags, main };
  return Api.Datasets.createDataset(organizationId, newDataset);
};

const updateDataset = (organizationId, datasetId, dataset) => {
  return Api.Datasets.updateDataset(organizationId, datasetId, dataset);
};

const updateSecurity = async (organizationId, datasetId, currentSecurity, newSecurity) => {
  const setDefaultSecurity = async (newRole) =>
    Api.Datasets.setDatasetDefaultSecurity(organizationId, datasetId, { role: newRole });
  const addAccess = async (newEntry) => Api.Datasets.addDatasetAccessControl(organizationId, datasetId, newEntry);
  const updateAccess = async (userIdToUpdate, newRole) =>
    Api.Datasets.updateDatasetAccessControl(organizationId, datasetId, userIdToUpdate, { role: newRole });
  const removeAccess = async (userIdToRemove) =>
    Api.Datasets.removeDatasetAccessControl(organizationId, datasetId, userIdToRemove);

  await SecurityUtils.updateResourceSecurity(
    currentSecurity,
    newSecurity,
    setDefaultSecurity,
    addAccess,
    updateAccess,
    removeAccess
  );
};

const deleteDataset = (organizationId, datasetId) => {
  return Api.Datasets.deleteDataset(organizationId, datasetId);
};

const DatasetService = {
  findDatasetById,
  createDataset,
  updateDataset,
  updateSecurity,
  deleteDataset,
};

export default DatasetService;
