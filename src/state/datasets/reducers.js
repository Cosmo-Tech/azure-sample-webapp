// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createSlice } from '@reduxjs/toolkit';
import { ResourceUtils } from '@cosmotech/core';
import { STATUSES } from '../../services/config/StatusConstants';
import { DatasetsUtils } from '../../utils';

export const datasetInitialState = {
  list: {
    data: [],
    status: STATUSES.IDLE,
  },
  selectedDatasetIndex: null,
};
const datasetSlice = createSlice({
  name: 'dataset',
  initialState: datasetInitialState,
  reducers: {
    loadDatasets: (state) => {
      state.list.status = STATUSES.LOADING;
      state.selectedDatasetIndex = null;
    },
    setAllDatasets: (state, action) => {
      const { list, status } = action.payload;
      state.list.data = list;
      state.list.status = status;
    },
    addDataset: (state, action) => {
      state.list.data.push(action.payload);
    },
    setDatasetSecurity: (state, action) => {
      const { datasetId, security, userEmail, userId, permissionsMapping } = action.payload;
      state.list.data = state.list.data?.map((datasetData) => {
        if (datasetData.id === datasetId) {
          const datasetWithNewSecurity = { ...datasetData, security };
          DatasetsUtils.patchDatasetWithCurrentUserPermissions(
            datasetWithNewSecurity,
            userEmail,
            userId,
            permissionsMapping
          );
          return { ...datasetData, security: datasetWithNewSecurity.security };
        }
        return datasetData;
      });
    },
    updateDataset: (state, action) => {
      const { datasetIndex, datasetId, datasetData } = action.payload;
      const index = datasetIndex ?? state.list.data.findIndex((dataset) => dataset.id === datasetId);
      state.list.data[index] = { ...state.list.data[index], ...datasetData };
    },
    deleteDataset: (state, action) => {
      const { datasetId } = action.payload;
      const index = state.list.data.findIndex((dataset) => dataset.id === datasetId);
      state.list.data.splice(index, 1);
    },
    selectDataset: (state, action) => {
      const { selectedDatasetId } = action.payload;
      const targetDatasetIndex = state.list.data.findIndex((dataset) => dataset.id === selectedDatasetId);
      state.selectedDatasetIndex = targetDatasetIndex !== -1 ? targetDatasetIndex : null;
    },
    selectDefaultDataset: (state, action) => {
      const { selectableDatasets } = action.payload;
      const datasets = selectableDatasets ?? state.list.data;
      const targetDatasetId = ResourceUtils.getResourceTree(datasets)?.[0]?.id;
      const targetDatasetIndex = state.list.data.findIndex((dataset) => dataset.id === targetDatasetId);
      state.selectedDatasetIndex = targetDatasetIndex !== -1 ? targetDatasetIndex : null;
    },
  },
});

export const {
  loadDatasets,
  setAllDatasets,
  addDataset,
  setDatasetSecurity,
  updateDataset,
  deleteDataset,
  selectDataset,
  selectDefaultDataset,
} = datasetSlice.actions;
export default datasetSlice.reducer;
