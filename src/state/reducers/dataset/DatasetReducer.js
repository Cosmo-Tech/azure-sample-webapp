// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DATASET_ACTIONS_KEY } from '../../commons/DatasetConstants';
import { STATUSES } from '../../commons/Constants';
import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

export const datasetListInitialState = {
  data: [],
  status: STATUSES.IDLE,
};

export const datasetListReducer = createReducer(datasetListInitialState, (builder) => {
  builder
    .addCase(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, (state, action) => {
      state.status = STATUSES.LOADING;
    })
    .addCase(DATASET_ACTIONS_KEY.SET_ALL_DATASETS, (state, action) => {
      state.data = action.list;
      state.status = action.status;
    })
    .addCase(DATASET_ACTIONS_KEY.ADD_DATASET, (state, action) => {
      delete action.type;
      state.data.push(action);
    })
    .addCase(DATASET_ACTIONS_KEY.UPDATE_DATASET, (state, action) => {
      const index = action.datasetIndex ?? state.data.findIndex((dataset) => dataset.id === action.datasetId);
      state.data[index] = { ...state.data[index], ...action.datasetData };
    })
    .addCase(DATASET_ACTIONS_KEY.DELETE_DATASET, (state, action) => {
      const index = state.data.findIndex((dataset) => dataset.id === action.datasetId);
      state.data.splice(index, 1);
    });
});

export const selectedDatasetInitialState = {
  data: null,
};

export const selectedDatasetReducer = createReducer(selectedDatasetInitialState, (builder) => {
  builder
    .addCase(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, (state, action) => {
      state.data = null;
    })
    .addCase(DATASET_ACTIONS_KEY.SET_ALL_DATASETS, (state, action) => {
      state.data = action.selectedDatasetIndex;
    })
    .addCase(DATASET_ACTIONS_KEY.SET_CURRENT_DATASET_INDEX, (state, action) => {
      state.data = action.selectedDatasetIndex;
    });
});

export const datasetReducer = combineReducers({
  list: datasetListReducer,
  selectedDatasetIndex: selectedDatasetReducer,
});
