// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { CosmotechApiService } from '../../configs/Api.config';

const ScenariorunApi = new CosmotechApiService.ScenariorunApi();

function runScenario (organizationId, workspaceId, scenarioId) {
  return new Promise((resolve) => {
    ScenariorunApi.runScenario(organizationId, workspaceId, scenarioId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

const ScenariorunService = {
  runScenario
};

export default ScenariorunService;
