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

const DatasetService = {
  findAllDatasets
};

export default DatasetService;
