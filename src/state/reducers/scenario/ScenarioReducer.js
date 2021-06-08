// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { combineReducers } from 'redux';
import { SCENARIO_ACTIONS_KEY } from '../../commons/ScenarioConstants';
import { STATUSES } from '../../commons/Constants';
import { createReducer } from '@reduxjs/toolkit';

// Scenario List

export const scenarioListInitialState = {
  data: [],
  status: STATUSES.IDLE
};

export const scenarioListReducer = createReducer(scenarioListInitialState, (builder) => {
  builder
    .addCase(SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS, (state, action) => { state.status = STATUSES.LOADING; })
    .addCase(SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS, (state, action) => {
      state.data = action.list;
      state.status = STATUSES.SUCCESS;
    })
    .addCase(SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO_STATE, (state, action) => {
      state.data = state.data.map(scenarioData => {
        // Replace state in data for the scenario to update
        if (scenarioData.id === action.data.scenarioId) {
          return { ...scenarioData, state: action.data.scenarioState };
        }
        // Otherwise, use the original data
        return scenarioData;
      });
    });
});

// Current Scenario

export const currentScenarioInitialState = {
  data: null,
  status: STATUSES.IDLE
};

export const currentScenarioReducer = createReducer(currentScenarioInitialState, (builder) => {
  builder
    .addCase(SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, (state, action) => {
      state.data = {
        ...state.data,
        ...action.data.scenario
      };
      state.status = action.data.status;
      // TODO: remove this when scenario states are available via the REST API
      state.data.state = 'Successful';
    })
    .addCase(SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO_STATE, (state, action) => {
      // Replace state in data if the scenario to update is currently selected
      if (state.data.id === action.data.scenarioId) {
        state.data = {
          ...state.data,
          // TODO: restore this when scenario states are available via the REST API
          // state: action.data.scenarioState
          state: 'Successful'
        };
      }
    });
});

export const scenarioReducer = combineReducers({
  list: scenarioListReducer,
  current: currentScenarioReducer
});
