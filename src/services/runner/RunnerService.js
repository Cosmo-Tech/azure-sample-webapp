// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SecurityUtils } from '../../utils';
import { Api } from '../config/Api';

const updateSecurity = async (organizationId, workspaceId, runnerId, currentSecurity, newSecurity) => {
  const setDefaultSecurity = async (newRole) =>
    Api.Runners.setRunnerDefaultSecurity(organizationId, workspaceId, runnerId, { role: newRole });
  const addAccess = async (newEntry) =>
    Api.Runners.addRunnerAccessControl(organizationId, workspaceId, runnerId, newEntry);
  const updateAccess = async (userIdToUpdate, newRole) =>
    Api.Runners.updateRunnerAccessControl(organizationId, workspaceId, runnerId, userIdToUpdate, { role: newRole });
  const removeAccess = async (userIdToRemove) =>
    Api.Runners.removeRunnerAccessControl(organizationId, workspaceId, runnerId, userIdToRemove);

  await SecurityUtils.updateResourceSecurity(
    currentSecurity,
    newSecurity,
    setDefaultSecurity,
    addAccess,
    updateAccess,
    removeAccess
  );
};

const RunnerService = {
  updateSecurity,
};

export default RunnerService;
