// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { CosmotechApiService } from '../../configs/Api.config';

const SolutionApi = new CosmotechApiService.SolutionApi();

function findSolutionById (organizationId, solutionId) {
  return new Promise((resolve) => {
    SolutionApi.findSolutionById(organizationId, solutionId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

const SolutionService = {
  findSolutionById
};

export default SolutionService;
