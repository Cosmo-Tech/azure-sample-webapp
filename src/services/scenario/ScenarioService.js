// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Api } from '../../services/config/Api';
import { SecurityUtils } from '../../utils';
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
  const data = { validationStatus };
  return Api.Scenarios.updateScenario(organizationId, workspaceId, scenarioId, data);
}

async function updateSecurity(organizationId, workspaceId, scenarioId, currentSecurity, newSecurity) {
  const setDefaultSecurity = async (newRole) =>
    Api.Scenarios.setScenarioDefaultSecurity(organizationId, workspaceId, scenarioId, { role: newRole });
  const addAccess = async (newEntry) =>
    Api.Scenarios.addScenarioAccessControl(organizationId, workspaceId, scenarioId, newEntry);
  const updateAccess = async (userIdToUpdate, newRole) =>
    Api.Scenarios.updateScenarioAccessControl(organizationId, workspaceId, scenarioId, userIdToUpdate, {
      role: newRole,
    });
  const removeAccess = async (userIdToRemove) =>
    Api.Scenarios.removeScenarioAccessControl(organizationId, workspaceId, scenarioId, userIdToRemove);

  return SecurityUtils.updateResourceSecurity(
    currentSecurity,
    newSecurity,
    setDefaultSecurity,
    addAccess,
    updateAccess,
    removeAccess
  );
}

const ScenarioService = {
  resetValidationStatus,
  setScenarioValidationStatusToValidated,
  setScenarioValidationStatusToRejected,
  updateSecurity,
};

export default ScenarioService;
