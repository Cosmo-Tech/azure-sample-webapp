// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createSlice } from '@reduxjs/toolkit';
import { ResourceUtils } from '@cosmotech/core';
import { DatasetsUtils } from '../../utils';
import { DATASET_REDUCER_STATUS } from './constants';

export const datasetInitialState = {
  list: {
    data: [],
    status: DATASET_REDUCER_STATUS.IDLE,
  },
  selectedDatasetIndex: null,
};

const datasetSlice = createSlice({
  name: 'dataset',
  initialState: datasetInitialState,
  reducers: {
    setDatasetReducerStatus: (state, action) => {
      const { status } = action.payload;
      state.list.status = status;
    },
    loadDatasets: (state) => {
      state.list.status = DATASET_REDUCER_STATUS.LOADING;
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
    addOrUpdateDatasetPart: (state, action) => {
      const { datasetIndex, datasetId, datasetPart: newDatasetPart } = action.payload;

      const index = datasetIndex ?? state.list.data.findIndex((dataset) => dataset.id === datasetId);
      if (index == null || index === -1) {
        console.warn(`Can't update parts of dataset with id "${datasetId}": dataset not found`);
        return;
      }

      let found = false;
      const newDatasetParts = state.list.data[index].parts.map((datasetPart) => {
        if (datasetPart.name !== newDatasetPart.name) return datasetPart;

        found = true;
        return newDatasetPart;
      });
      if (!found) newDatasetParts.push(newDatasetPart);

      state.list.data[index].parts = newDatasetParts;
    },
    deleteDataset: (state, action) => {
      const { datasetId } = action.payload;
      const index = state.list.data.findIndex((dataset) => dataset.id === datasetId);
      state.list.data.splice(index, 1);
    },
    deleteDatasetPart: (state, action) => {
      const { datasetId, datasetPartId: partIdToDelete } = action.payload;
      const index = state.list.data.findIndex((dataset) => dataset.id === datasetId);
      if (index == null || index === -1) {
        console.warn(`Can't delete parts of dataset with id "${datasetId}": dataset not found`);
        return;
      }
      const dataset = state.list.data[index];
      state.list.data[index] = { ...dataset, parts: dataset.parts.filter((partId) => partId !== partIdToDelete) };
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
  addOrUpdateDatasetPart,
  setDatasetSecurity,
  updateDataset,
  deleteDataset,
  deleteDatasetPart,
  selectDataset,
  selectDefaultDataset,
  setDatasetReducerStatus,
} = datasetSlice.actions;
export default datasetSlice.reducer;
