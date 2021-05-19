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

function getScenariosTree (organizationId, workspaceId) {
  return new Promise((resolve) => {
    ScenarioApi.getScenariosTree(organizationId, workspaceId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function findScenarioById (organizationId, workspaceId, scenarioId) {
  return new Promise((resolve) => {
    ScenarioApi.findScenarioById(organizationId, workspaceId, scenarioId, (error, data, response) => {
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

function launchScenario (organizationId, workspaceId, scenarioId) {
  // TODO
}

const ScenarioService = {
  findAllScenarios,
  getScenariosTree,
  findScenarioById,
  createScenario,
  updateScenarioParameters,
  launchScenario
};

export default ScenarioService;
