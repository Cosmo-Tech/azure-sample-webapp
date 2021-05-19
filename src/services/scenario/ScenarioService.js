// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { CosmotechApiService } from '../../configs/Api.config';
import rfdc from 'rfdc';

const ScenarioApi = new CosmotechApiService.ScenarioApi();
const clone = rfdc();

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

function formatScenarioParametersForApi (scenarioParameters) {
  // Reformat scenario parameters to match the API expected types
  return scenarioParameters.map(param => {
    // Clone the original parameter
    const newParam = clone(param);
    // Cast boolean values into string values
    if (newParam.varType === 'bool') {
      newParam.value = newParam.value.toString();
    }
    return newParam;
  });
}

function formatScenarioParametersFromApi (scenarioParameters) {
  if (!scenarioParameters) {
    return undefined;
  }
  // Reformat scenario parameters to match the front-end expected types
  return scenarioParameters.map(param => {
    // Clone the original parameter
    const newParam = clone(param);
    // Cast string values into boolean values
    if (newParam.varType === 'bool') {
      newParam.value = (newParam.value === 'true');
    }
    return newParam;
  });
}

function updateScenarioParameters (organizationId, workspaceId, scenarioId, scenarioParameters) {
  const formattedParameters = formatScenarioParametersForApi(scenarioParameters);
  return new Promise((resolve) => {
    ScenarioApi.addOrReplaceScenarioParameterValues(organizationId, workspaceId, scenarioId, formattedParameters, (error, data, response) => {
      data = formatScenarioParametersFromApi(data);
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
