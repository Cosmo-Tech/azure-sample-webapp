// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { ResourceUtils } from '@cosmotech/core';
import { DatasetsUtils } from '../../../utils';
import { STATUSES } from '../../commons/Constants';
import { DATASET_ACTIONS_KEY } from '../../commons/DatasetConstants';

export const datasetInitialState = {
  list: {
    data: [],
    status: STATUSES.IDLE,
  },
  selectedDatasetIndex: null,
};

export const datasetsReducer = createReducer(datasetInitialState, (builder) => {
  builder
    .addCase(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, (state) => {
      state.list.status = STATUSES.LOADING;
      state.selectedDatasetIndex = null;
    })
    .addCase(DATASET_ACTIONS_KEY.SET_ALL_DATASETS, (state, action) => {
      state.list.data = action.list;
      state.list.status = action.status;
    })
    .addCase(DATASET_ACTIONS_KEY.ADD_DATASET, (state, action) => {
      delete action.type;
      state.list.data.push(action);
    })
    .addCase(DATASET_ACTIONS_KEY.SET_DATASET_SECURITY, (state, action) => {
      state.list.data = state.list.data?.map((datasetData) => {
        if (datasetData.id === action.datasetId) {
          const datasetWithNewSecurity = { ...datasetData, security: action.security };
          DatasetsUtils.patchDatasetWithCurrentUserPermissions(
            datasetWithNewSecurity,
            action.userEmail,
            action.userId,
            action.permissionsMapping
          );
          return { ...datasetData, security: datasetWithNewSecurity.security };
        }
        return datasetData;
      });
    })
    .addCase(DATASET_ACTIONS_KEY.UPDATE_DATASET, (state, action) => {
      const index = action.datasetIndex ?? state.list.data.findIndex((dataset) => dataset.id === action.datasetId);
      state.list.data[index] = { ...state.list.data[index], ...action.datasetData };
    })
    .addCase(DATASET_ACTIONS_KEY.DELETE_DATASET, (state, action) => {
      const index = state.list.data.findIndex((dataset) => dataset.id === action.datasetId);
      state.list.data.splice(index, 1);
    })
    .addCase(DATASET_ACTIONS_KEY.SELECT_DATASET, (state, action) => {
      const targetDatasetIndex = state.list.data.findIndex((dataset) => dataset.id === action.selectedDatasetId);
      state.selectedDatasetIndex = targetDatasetIndex !== -1 ? targetDatasetIndex : null;
    })
    .addCase(DATASET_ACTIONS_KEY.SELECT_DEFAULT_DATASET, (state, action) => {
      const selectableDatasets = action.selectableDatasets ?? state.list.data;
      const targetDatasetId = ResourceUtils.getResourceTree(selectableDatasets)?.[0]?.id;
      const targetDatasetIndex = state.list.data.findIndex((dataset) => dataset.id === targetDatasetId);
      state.selectedDatasetIndex = targetDatasetIndex !== -1 ? targetDatasetIndex : null;
    });
});
