// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DatasetApi } from '../ServiceCommons';
import { CosmotechApiService } from '../../configs/Api.config';

async function findAllDatasets (organizationId) {
  const datasets = await DatasetApi.findAllDatasets(organizationId);
  return datasets;
}

async function findDatasetById (organizationId, datasetId) {
  const dataset = await DatasetApi.findDatasetById(organizationId, datasetId);
  return dataset;
}

async function createDataset (organizationId, name, description, connector, tags) {
  const newDataset = new CosmotechApiService.Dataset();
  newDataset.name = name;
  newDataset.description = description;
  newDataset.connector = connector;
  newDataset.tags = tags;
  const datasetCreated = await DatasetApi.createDataset(organizationId, newDataset);
  return datasetCreated;
}

async function updateDataset (organizationId, datasetId, dataset) {
  const updatedDataset = await DatasetApi.updateDataset(organizationId, datasetId, dataset);
  return updatedDataset;
}

async function deleteDataset (organizationId, datasetId) {
  const deletedDataset = await DatasetApi.deleteDataset(organizationId, datasetId);
  return deletedDataset;
}

const DatasetService = {
  findAllDatasets,
  findDatasetById,
  createDataset,
  updateDataset,
  deleteDataset
};

export default DatasetService;
