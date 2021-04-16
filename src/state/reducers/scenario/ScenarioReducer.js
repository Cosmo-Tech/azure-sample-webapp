// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { combineReducers } from 'redux'
import { SCENARIO_STATUS, SCENARIO_ACTIONS_KEY } from '../../commons/ScenarioConstants'
import { createReducer } from '@reduxjs/toolkit'

// Scenario List

export const scenarioListInitialState = {
  data: [],
  status: SCENARIO_STATUS.IDLE
}

export const scenarioListReducer = createReducer(scenarioListInitialState, (builder) => {
  builder
    .addCase(SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS, (state, action) => { state.status = SCENARIO_STATUS.LOADING })
    .addCase(SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS, (state, action) => {
      state.data = action.list
      state.status = SCENARIO_STATUS.SUCCESS
    })
})

// Scenario Tree

export const scenarioTreeInitialState = {
  data: [],
  status: SCENARIO_STATUS.IDLE
}

export const scenarioTreeReducer = createReducer(scenarioTreeInitialState, (builder) => {
  builder
    .addCase(SCENARIO_ACTIONS_KEY.GET_SCENARIO_TREE, (state, action) => { state.status = SCENARIO_STATUS.LOADING })
    .addCase(SCENARIO_ACTIONS_KEY.SET_SCENARIO_TREE, (state, action) => {
      state.data = action.tree
      state.status = SCENARIO_STATUS.SUCCESS
    })
})

// Current Scenario

export const currentScenarioInitialState = {
  data: null,
  status: SCENARIO_STATUS.IDLE
}

export const currentScenarioReducer = createReducer(currentScenarioInitialState, (builder) => {
  builder
    .addCase(SCENARIO_ACTIONS_KEY.GET_CURRENT_SCENARIO, (state, action) => { state.status = SCENARIO_STATUS.LOADING })
    .addCase(SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, (state, action) => {
      state.data = action.data
      state.status = SCENARIO_STATUS.SUCCESS
    })
})

export const scenarioReducer = combineReducers({ list: scenarioListReducer, current: currentScenarioReducer, tree: scenarioTreeReducer })
