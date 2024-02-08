// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { SCENARIO_RUN_ACTIONS } from '../../commons/ScenarioRunConstants';

const scenarioRunsListInitialState = {
  data: [],
};

export const scenarioRunReducer = createReducer(scenarioRunsListInitialState, (builder) => {
  builder
    .addCase(SCENARIO_RUN_ACTIONS.ADD_OR_UPDATE, (state, action) => {
      // Add scenario run if it hasn't been stored yet
      if (state.data.map((scenarioRun) => scenarioRun.id).includes(action.data.id) === false) {
        state.data.push(action.data);
      }
      // Otherwise, update its value
      state.data = state.data.map((scenarioRun) => (scenarioRun.id === action.data.id ? action.data : scenarioRun));
    })
    .addCase(SCENARIO_RUN_ACTIONS.SET_RUN_STATUS, (state, action) => {
      state.data = state.data.map((scenarioRun) => {
        if (scenarioRun.id === action.data.id) {
          return {
            ...scenarioRun,
            status: action.data,
          };
        }
        return scenarioRun;
      });
    });
});
