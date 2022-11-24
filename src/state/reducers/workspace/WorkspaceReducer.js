// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { STATUSES } from '../../commons/Constants';
import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { WORKSPACE_ACTIONS_KEY } from '../../commons/WorkspaceConstants';

const currentWorkspaceInitialState = {
  data: null,
  status: STATUSES.IDLE,
};

const currentWorkspaceReducer = createReducer(currentWorkspaceInitialState, (builder) => {
  builder.addCase(WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE, (state, action) => {
    state.data = action.workspace;
    state.status = action.status;
  });
});

const workspacesListInitialState = {
  data: [],
  status: STATUSES.IDLE,
};

const workspacesListReducer = createReducer(workspacesListInitialState, (builder) => {
  builder.addCase(WORKSPACE_ACTIONS_KEY.SET_ALL_WORKSPACES, (state, action) => {
    state.data = action.list;
    state.status = action.status;
  });
});

export const workspaceReducer = combineReducers({
  current: currentWorkspaceReducer,
  list: workspacesListReducer,
});
