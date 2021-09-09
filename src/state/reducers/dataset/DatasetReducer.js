// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DATASET_ACTIONS_KEY } from '../../commons/DatasetConstants';
import { STATUSES } from '../../commons/Constants';
import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

export const datasetListInitialState = {
  data: [],
  status: STATUSES.IDLE
};

export const datasetListReducer = createReducer(datasetListInitialState, (builder) => {
  builder
    .addCase(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, (state, action) => { state.status = STATUSES.LOADING; })
    .addCase(DATASET_ACTIONS_KEY.SET_ALL_DATASETS, (state, action) => {
      state.data = action.list;
      state.status = action.status;
    });
});

export const datasetReducer = combineReducers({ list: datasetListReducer });
