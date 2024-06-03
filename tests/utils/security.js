// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_APPLICATION } from '../samples';

export const applyScenarioRoleToState = (state, role) => {
  state.runner.current.data.security.currentUserPermissions = DEFAULT_APPLICATION.permissionsMapping.runner[role];
};

export const applyWorkspaceRoleToState = (state, role) => {
  state.workspace.current.data.security.currentUserPermissions = DEFAULT_APPLICATION.permissionsMapping.workspace[role];
};
