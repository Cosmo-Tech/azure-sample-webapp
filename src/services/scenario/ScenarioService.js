// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { CosmotechApiService } from '../../configs/Api.config';
import { ScenarioRunUtils } from '@cosmotech/core';

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
      data.parametersValues = ScenarioRunUtils.formatParametersFromApi(data.parametersValues);
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
  const formattedParameters = ScenarioRunUtils.formatParametersForApi(scenarioParameters);
  return new Promise((resolve) => {
    ScenarioApi.updateScenario(organizationId, workspaceId, scenarioId, formattedParameters, (error, data, response) => {
      data = ScenarioRunUtils.formatParametersFromApi(data.parametersValues);
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
