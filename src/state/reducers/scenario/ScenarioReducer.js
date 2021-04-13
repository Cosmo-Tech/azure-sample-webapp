// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { combineReducers } from 'redux'
import { SCENARIO_STATUS, SCENARIO_ACTIONS_KEY } from '../../commons/ScenarioConstants'
import { createReducer } from '@reduxjs/toolkit'

// Scenario List

export const scenarioListInitialState = {
  list: [],
  status: SCENARIO_STATUS.IDLE
}

export const scenarioListReducer = createReducer(scenarioListInitialState, (builder) => {
  builder
    .addCase(SCENARIO_ACTIONS_KEY.GET_SCENARIO_LIST, (state, action) => { state.status = SCENARIO_STATUS.LOADING })
    .addCase(SCENARIO_ACTIONS_KEY.SET_SCENARIO_LIST, (state, action) => {
      state.status = SCENARIO_STATUS.SUCCESS
      state.list = action.list
    })
})

// Current Scenario

export const currentScenarioInitialState = {
  scenario: null,
  status: SCENARIO_STATUS.IDLE
}

const currentScenarioReducer = createReducer(currentScenarioInitialState, (builder) => {
  builder
    .addCase(SCENARIO_ACTIONS_KEY.GET_CURRENT_SCENARIO, (state, action) => { state.status = SCENARIO_STATUS.LOADING })
    .addCase(SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, (state, action) => {
      state.scenario = action.scenario
      state.list = action.list
    })
})

export const scenarioReducer = combineReducers(scenarioListReducer, currentScenarioReducer)
