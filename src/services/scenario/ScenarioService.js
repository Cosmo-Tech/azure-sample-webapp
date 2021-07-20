// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ScenarioRunUtils } from '@cosmotech/core';
import { ScenarioApi } from '../ServiceCommons';

async function findAllScenarios (organizationId, workspaceId) {
  const result = await ScenarioApi.findAllScenarios(organizationId, workspaceId);
  return result;
}

async function findScenarioById (organizationId, workspaceId, scenarioId) {
  const response = await ScenarioApi.findScenarioById(organizationId, workspaceId, scenarioId);
  if (response) {
    response.parametersValues = ScenarioRunUtils.formatParametersFromApi(response.parametersValues);
  }
  return response;
}

async function createScenario (organizationId, workspaceId, scenario) {
  const result = await ScenarioApi.createScenario(organizationId, workspaceId, scenario);
  return result;
}

async function updateScenarioParameters (organizationId, workspaceId, scenarioId, scenarioParameters) {
  const formattedParameters = ScenarioRunUtils.formatParametersForApi(scenarioParameters);
  const response = await ScenarioApi.updateScenario(organizationId, workspaceId, scenarioId, formattedParameters);
  if (response) {
    response.parametersValues = ScenarioRunUtils.formatParametersFromApi(response.parametersValues);
  }
  return response;
}

const ScenarioService = {
  findAllScenarios,
  findScenarioById,
  createScenario,
  updateScenarioParameters
};

export default ScenarioService;
