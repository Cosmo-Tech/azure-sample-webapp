// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { WORKSPACE_ACTIONS_KEY } from '../../commons/WorkspaceConstants';

export const dispatchSelectWorkspace = (workspaceId) => ({
  type: WORKSPACE_ACTIONS_KEY.SELECT_WORKSPACE,
  workspaceId,
});

export const dispatchResetCurrentWorkspace = () => ({
  type: WORKSPACE_ACTIONS_KEY.RESET_CURRENT_WORKSPACE,
});
