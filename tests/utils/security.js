// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_APPLICATION } from '../samples';

export const applyScenarioRoleToState = (state, role) => {
  const currentScenario = state.runner.simulationRunners.current.data;
  currentScenario.security.currentUserPermissions = DEFAULT_APPLICATION.permissionsMapping.runner[role];
  state.runner.simulationRunners.list.data = state.runner.simulationRunners.list.data.map((runner) =>
    runner.id === currentScenario.id ? currentScenario : runner
  );
};

export const applyWorkspaceRoleToState = (state, role) => {
  state.workspace.current.data.security.currentUserPermissions = DEFAULT_APPLICATION.permissionsMapping.workspace[role];
};
