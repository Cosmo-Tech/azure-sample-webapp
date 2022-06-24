// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Api } from '../../services/config/Api';
import { ORGANIZATION_ID } from '../../config/GlobalConfiguration';
import { SCENARIO_VALIDATION_STATUS } from '../config/ApiConstants.js';

async function resetValidationStatus(workspaceId, scenarioId) {
  const data = { validationStatus: SCENARIO_VALIDATION_STATUS.DRAFT };
  return Api.Scenarios.updateScenario(ORGANIZATION_ID, workspaceId, scenarioId, data);
}

async function setScenarioValidationStatusToValidated(workspaceId, scenarioId) {
  return setValidationStatus(workspaceId, scenarioId, SCENARIO_VALIDATION_STATUS.VALIDATED);
}

async function setScenarioValidationStatusToRejected(workspaceId, scenarioId) {
  return setValidationStatus(workspaceId, scenarioId, SCENARIO_VALIDATION_STATUS.REJECTED);
}

async function setValidationStatus(workspaceId, scenarioId, validationStatus) {
  const data = { validationStatus: validationStatus };
  return Api.Scenarios.updateScenario(ORGANIZATION_ID, workspaceId, scenarioId, data);
}

const ScenarioService = {
  resetValidationStatus,
  setScenarioValidationStatusToValidated,
  setScenarioValidationStatusToRejected,
};

export default ScenarioService;
