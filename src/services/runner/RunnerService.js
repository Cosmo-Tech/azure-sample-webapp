// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SecurityUtils } from '../../utils';
import { Api } from '../config/Api';
import { RUNNER_VALIDATION_STATUS } from '../config/ApiConstants';

const updateSecurity = async (organizationId, workspaceId, runnerId, currentSecurity, newSecurity) => {
  const setDefaultSecurity = async (newRole) =>
    Api.Runners.setRunnerDefaultSecurity(organizationId, workspaceId, runnerId, { role: newRole });
  const addAccess = async (newEntry) =>
    Api.Runners.addRunnerAccessControl(organizationId, workspaceId, runnerId, newEntry);
  const updateAccess = async (userIdToUpdate, newRole) =>
    Api.Runners.updateRunnerAccessControl(organizationId, workspaceId, runnerId, userIdToUpdate, { role: newRole });
  const removeAccess = async (userIdToRemove) =>
    Api.Runners.removeRunnerAccessControl(organizationId, workspaceId, runnerId, userIdToRemove);

  return SecurityUtils.updateResourceSecurity(
    currentSecurity,
    newSecurity,
    setDefaultSecurity,
    addAccess,
    updateAccess,
    removeAccess
  );
};

async function resetValidationStatus(organizationId, workspaceId, runnerId, runTemplateId) {
  const data = { runTemplateId, validationStatus: RUNNER_VALIDATION_STATUS.DRAFT };
  return Api.Runners.updateRunner(organizationId, workspaceId, runnerId, data);
}

async function setRunnerValidationStatusToValidated(organizationId, workspaceId, runnerId, runTemplateId) {
  return setValidationStatus(organizationId, workspaceId, runnerId, runTemplateId, RUNNER_VALIDATION_STATUS.VALIDATED);
}

async function setRunnerValidationStatusToRejected(organizationId, workspaceId, runnerId, runTemplateId) {
  return setValidationStatus(organizationId, workspaceId, runnerId, runTemplateId, RUNNER_VALIDATION_STATUS.REJECTED);
}

async function setValidationStatus(organizationId, workspaceId, runnerId, runTemplateId, validationStatus) {
  const data = { validationStatus, runTemplateId };
  return Api.Runners.updateRunner(organizationId, workspaceId, runnerId, data);
}

const RunnerService = {
  updateSecurity,
  resetValidationStatus,
  setRunnerValidationStatusToValidated,
  setRunnerValidationStatusToRejected,
};

export default RunnerService;
