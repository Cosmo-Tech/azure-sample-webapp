// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { STATUSES } from '../../commons/Constants';
import { WORKSPACE_ACTIONS_KEY } from '../../commons/WorkspaceConstants';

const currentWorkspaceInitialState = {
  data: null,
  status: STATUSES.IDLE,
};

const currentWorkspaceReducer = createReducer(currentWorkspaceInitialState, (builder) => {
  builder
    .addCase(WORKSPACE_ACTIONS_KEY.LINK_TO_DATASET, (state, action) => {
      const linkedDatasets = state.data?.linkedDatasetIdList;
      if (linkedDatasets != null && action.datasetId != null) linkedDatasets.push(action.datasetId);
    })
    .addCase(WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE, (state, action) => {
      state.data = action.workspace;
      state.status = action.status;
    })
    .addCase(WORKSPACE_ACTIONS_KEY.RESET_CURRENT_WORKSPACE, (state) => {
      state.data = null;
      state.status = STATUSES.IDLE;
    });
});

const workspacesListInitialState = {
  data: [],
  status: STATUSES.IDLE,
};

const workspacesListReducer = createReducer(workspacesListInitialState, (builder) => {
  builder
    .addCase(WORKSPACE_ACTIONS_KEY.LINK_TO_DATASET, (state, action) => {
      if (action.datasetId == null) return;

      const targetWorkspace = state.data.find((workspace) => workspace.id === action.workspaceId);
      const linkedDatasets = targetWorkspace?.linkedDatasetIdList;
      if (linkedDatasets != null) linkedDatasets.push(action.datasetId);
    })
    .addCase(WORKSPACE_ACTIONS_KEY.SET_ALL_WORKSPACES, (state, action) => {
      state.data = action.list;
      state.status = action.status;
    });
});

export const workspaceReducer = combineReducers({
  current: currentWorkspaceReducer,
  list: workspacesListReducer,
});
