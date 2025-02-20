// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { RUNNER_ACTIONS_KEY } from '../../commons/RunnerConstants';

const initialState = {
  etlRunners: [],
};

export const runnerReducer = createReducer(initialState, (builder) => {
  builder.addCase(RUNNER_ACTIONS_KEY.SET_ETL_RUNNERS, (state, action) => {
    state.etlRunners = action.data;
  });
});
