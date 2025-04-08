// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { WORKSPACE_ACTIONS_KEY } from './constants';

export const dispatchSelectWorkspace = (workspaceId) => ({
  type: WORKSPACE_ACTIONS_KEY.SELECT_WORKSPACE,
  workspaceId,
});
