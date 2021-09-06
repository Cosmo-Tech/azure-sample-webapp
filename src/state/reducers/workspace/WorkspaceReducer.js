// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Current Workspace

import { STATUSES } from '../../commons/Constants';
import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { WORKSPACE_ACTIONS_KEY } from '../../commons/WorkspaceConstants';

export const currentWorkspaceInitialState = {
  data: null,
  status: STATUSES.IDLE
};

export const currentWorkspaceReducer = createReducer(currentWorkspaceInitialState, (builder) => {
  builder
    .addCase(WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE, (state, action) => {
      state.data = action.workspace;
      state.status = action.status;
    });
});

export const workspaceReducer = combineReducers({
  current: currentWorkspaceReducer
});
