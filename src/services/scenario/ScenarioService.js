// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Api } from '../../services/config/Api';
import { SCENARIO_VALIDATION_STATUS } from '../config/ApiConstants.js';

async function resetValidationStatus(organizationId, workspaceId, scenarioId) {
  const data = { validationStatus: SCENARIO_VALIDATION_STATUS.DRAFT };
  return Api.Scenarios.updateScenario(organizationId, workspaceId, scenarioId, data);
}

async function setScenarioValidationStatusToValidated(organizationId, workspaceId, scenarioId) {
  return setValidationStatus(organizationId, workspaceId, scenarioId, SCENARIO_VALIDATION_STATUS.VALIDATED);
}

async function setScenarioValidationStatusToRejected(organizationId, workspaceId, scenarioId) {
  return setValidationStatus(organizationId, workspaceId, scenarioId, SCENARIO_VALIDATION_STATUS.REJECTED);
}

async function setValidationStatus(organizationId, workspaceId, scenarioId, validationStatus) {
  const data = { validationStatus: validationStatus };
  return Api.Scenarios.updateScenario(organizationId, workspaceId, scenarioId, data);
}

const ScenarioService = {
  resetValidationStatus,
  setScenarioValidationStatusToValidated,
  setScenarioValidationStatusToRejected,
};

export default ScenarioService;
