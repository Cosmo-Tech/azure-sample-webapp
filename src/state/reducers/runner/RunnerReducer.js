// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { RUNNER_ACTIONS_KEY } from '../../commons/RunnerConstants';

const initialState = {
  etlRunners: [],
};

export const runnerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(RUNNER_ACTIONS_KEY.SET_ETL_RUNNERS, (state, action) => {
      state.etlRunners = action.data;
    })
    .addCase(RUNNER_ACTIONS_KEY.UPDATE_ETL_RUNNER, (state, action) => {
      const runnerId = action.runnerId;
      const runner = action.runner;
      if (runner)
        state.etlRunners = state.etlRunners?.map((runnerData) => {
          if (runnerData.id === runnerId) {
            return { ...runnerData, ...runner };
          }
          return runnerData;
        });
    })
    .addCase(RUNNER_ACTIONS_KEY.ADD_ETL_RUNNER, (state, action) => {
      const runner = action.runner;
      state.etlRunners.push(runner);
    });
});
