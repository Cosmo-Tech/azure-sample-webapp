// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Redux Action (equivalent to dispatch function)
import { WORKSPACE_ACTIONS_KEY } from '../../commons/WorkspaceConstants';

export const dispatchGetWorkspaceById = (payLoad) => ({
  type: WORKSPACE_ACTIONS_KEY.GET_WORKSPACE_BY_ID,
  ...payLoad
});
