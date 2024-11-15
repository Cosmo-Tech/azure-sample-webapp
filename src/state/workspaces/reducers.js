// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createSlice } from '@reduxjs/toolkit';
import { STATUSES } from '../../services/config/StatusConstants';

const workspaceInitialState = {
  current: {
    data: null,
    status: STATUSES.IDLE,
  },
  list: {
    data: [],
    status: STATUSES.IDLE,
  },
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: workspaceInitialState,
  reducers: {
    linkToDataset: (state, action) => {
      const { datasetId, workspaceId } = action.payload;
      const targetWorkspace = state.list.data.find((workspace) => workspace.id === workspaceId);
      const linkedDatasets = targetWorkspace?.linkedDatasetIdList;
      if (linkedDatasets != null && datasetId != null) linkedDatasets.push(datasetId);
      const currentWorkspaceLinkedDatasets = state.current?.data?.linkedDatasetIdList;
      if (currentWorkspaceLinkedDatasets != null && datasetId != null) currentWorkspaceLinkedDatasets.push(datasetId);
    },
    setCurrentWorkspace: (state, action) => {
      const { workspace, status } = action.payload;
      state.current.data = workspace;
      state.current.status = status;
    },
    resetCurrentWorkspace: (state) => {
      state.current.data = null;
      state.current.status = STATUSES.IDLE;
    },
    setAllWorkspaces: (state, action) => {
      const { list, status } = action.payload;
      state.list.data = list;
      state.list.status = status;
    },
  },
});

export const { linkToDataset, setCurrentWorkspace, resetCurrentWorkspace, setAllWorkspaces } = workspaceSlice.actions;
export default workspaceSlice.reducer;
