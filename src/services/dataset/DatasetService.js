// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

class DatasetService {
  constructor (apiService) {
    this.apiService = apiService;
    this.datasetApi = new apiService.DatasetApi();
  }

  async findDatasetById (organizationId, datasetId) {
    const dataset = await this.datasetApi.findDatasetById(organizationId, datasetId);
    return dataset;
  }

  async createDataset (organizationId, name, description, connector, tags) {
    const newDataset = new this.apiService.Dataset();
    newDataset.name = name;
    newDataset.description = description;
    newDataset.connector = connector;
    newDataset.tags = tags;
    const datasetCreated = await this.datasetApi.createDataset(organizationId, newDataset);
    return datasetCreated;
  }

  async updateDataset (organizationId, datasetId, dataset) {
    const updatedDataset = await this.datasetApi.updateDataset(organizationId, datasetId, dataset);
    return updatedDataset;
  }

  async deleteDataset (organizationId, datasetId) {
    const deletedDataset = await this.datasetApi.deleteDataset(organizationId, datasetId);
    return deletedDataset;
  }
}

export default DatasetService;
