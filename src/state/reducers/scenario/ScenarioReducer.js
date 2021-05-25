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
    });
});

// Scenario Tree

export const scenarioTreeInitialState = {
  data: [],
  status: STATUSES.IDLE
};

export const scenarioTreeReducer = createReducer(scenarioTreeInitialState, (builder) => {
  builder
    .addCase(SCENARIO_ACTIONS_KEY.SET_SCENARIO_TREE, (state, action) => {
      state.data = action.tree;
      state.status = STATUSES.SUCCESS;
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
    });
});

export const scenarioReducer = combineReducers({
  list: scenarioListReducer,
  current: currentScenarioReducer,
  tree: scenarioTreeReducer
});
