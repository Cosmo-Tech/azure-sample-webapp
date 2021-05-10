// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { CosmotechApiService } from '../../configs/Api.config';

const ScenarioApi = new CosmotechApiService.ScenarioApi();

function findAllScenarios (organizationId, workspaceId) {
  return new Promise((resolve, reject) => {
    ScenarioApi.findAllScenarios(organizationId, workspaceId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function getScenariosTree (organizationId, workspaceId) {
  return new Promise((resolve, reject) => {
    ScenarioApi.getScenariosTree(organizationId, workspaceId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function findScenarioById (organizationId, workspaceId, scenarioId) {
  return new Promise((resolve, reject) => {
    ScenarioApi.findScenarioById(organizationId, workspaceId, scenarioId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

const ScenarioService = {
  findAllScenarios,
  getScenariosTree,
  findScenarioById
};

export default ScenarioService;
