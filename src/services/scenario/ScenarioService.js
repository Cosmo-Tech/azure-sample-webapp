// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { CosmotechApiService } from '../../configs/Api.config';
import {
  formatParametersForApi,
  formatParametersFromApi
} from '../../utils/ApiUtils';

const ScenarioApi = new CosmotechApiService.ScenarioApi();

function findAllScenarios (organizationId, workspaceId) {
  return new Promise((resolve) => {
    ScenarioApi.findAllScenarios(organizationId, workspaceId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function findScenarioById (organizationId, workspaceId, scenarioId) {
  return new Promise((resolve) => {
    ScenarioApi.findScenarioById(organizationId, workspaceId, scenarioId, (error, data, response) => {
      // Parse scenario parameters
      data.parametersValues = formatParametersFromApi(data.parametersValues);
      resolve({ error, data, response });
    });
  });
}

function createScenario (organizationId, workspaceId, scenario) {
  return new Promise((resolve) => {
    ScenarioApi.createScenario(organizationId, workspaceId, scenario, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function updateScenarioParameters (organizationId, workspaceId, scenarioId, scenarioParameters) {
  const formattedParameters = formatParametersForApi(scenarioParameters);
  return new Promise((resolve) => {
    ScenarioApi.addOrReplaceScenarioParameterValues(organizationId, workspaceId, scenarioId, formattedParameters, (error, data, response) => {
      data = formatParametersFromApi(data);
      resolve({ error, data, response });
    });
  });
}

const ScenarioService = {
  findAllScenarios,
  findScenarioById,
  createScenario,
  updateScenarioParameters
};

export default ScenarioService;
