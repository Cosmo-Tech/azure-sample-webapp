// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Api } from '../../services/config/Api';

function findDatasetById (organizationId, datasetId) {
  return Api.Datasets.findDatasetById(organizationId, datasetId);
}

function createDataset (organizationId, name, description, connector, tags) {
  const newDataset = { name: name, description: description, connector: connector, tags: tags };
  return Api.Datasets.createDataset(organizationId, newDataset);
}

function updateDataset (organizationId, datasetId, dataset) {
  return Api.Datasets.updateDataset(organizationId, datasetId, dataset);
}

function deleteDataset (organizationId, datasetId) {
  return Api.Datasets.deleteDataset(organizationId, datasetId);
}

const DatasetService = {
  findDatasetById,
  createDataset,
  updateDataset,
  deleteDataset
};

export default DatasetService;
