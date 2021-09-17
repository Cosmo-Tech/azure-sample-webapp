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
      state.status = action.status;
    })
    .addCase(SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO, (state, action) => {
      state.data = state.data.map(scenarioData => {
        // Replace state and lastRun in data for the scenario to update
        if (scenarioData.id === action.data.scenarioId) {
          return { ...scenarioData, state: action.data.scenarioState, lastRun: action.data.lastRun };
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
    .addCase(SCENARIO_ACTIONS_KEY.RESET_CURRENT_SCENARIO, (state) => {
      state.data = null;
      state.status = STATUSES.IDLE;
    })
    .addCase(SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, (state, action) => {
      if (action.scenario != null) {
        state.data = {
          ...state.data,
          ...action.scenario
        };
      } else {
        state.data = null;
      }
      state.status = action.status;
    })
    .addCase(SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO, (state, action) => {
      // Replace state and lastRun in data if the scenario to update is currently selected
      if (state.data.id === action.data.scenarioId) {
        state.data = {
          ...state.data,
          state: action.data.scenarioState,
          lastRun: action.data.lastRun
        };
      }
    });
});

export const scenarioReducer = combineReducers({
  list: scenarioListReducer,
  current: currentScenarioReducer
});
