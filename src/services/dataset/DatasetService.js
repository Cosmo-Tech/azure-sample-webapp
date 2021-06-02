// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { CosmotechApiService } from '../../configs/Api.config';

const DatasetApi = new CosmotechApiService.DatasetApi();

function findAllDatasets (organizationId) {
  return new Promise((resolve) => {
    DatasetApi.findAllDatasets(organizationId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function findDatasetById (organizationId, datasetId) {
  return new Promise((resolve) => {
    DatasetApi.findDatasetById(organizationId, datasetId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function createDataset (organizationId, name, description, connector) {
  return new Promise((resolve) => {
    const newDataset = new CosmotechApiService.Dataset();
    newDataset.name = name;
    newDataset.description = description;
    newDataset.connector = connector;
    DatasetApi.createDataset(organizationId, newDataset, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function updateDataset (organizationId, datasetId, dataset) {
  return new Promise((resolve) => {
    DatasetApi.updateDataset(organizationId, datasetId, dataset, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function deleteDataset (organizationId, datasetId) {
  return new Promise((resolve) => {
    DatasetApi.createDataset(organizationId, datasetId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

const DatasetService = {
  findAllDatasets,
  findDatasetById,
  createDataset,
  updateDataset,
  deleteDataset
};

export default DatasetService;
