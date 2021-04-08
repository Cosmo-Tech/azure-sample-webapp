// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { combineReducers } from 'redux'
import { SCENARIO_STATUS } from './ScenarioConstants'
import { SCENARIO_ACTIONS } from './ScenarioActions'

export const scenarioReducer = combineReducers({
  scenarioList: (
    state = {
      list: [],
      status: SCENARIO_STATUS.IDLE
    },
    action
  ) => {
    switch (action.type) {
      case SCENARIO_ACTIONS.GET_SCENARIO_LIST:
        return {
          ...state,
          status: SCENARIO_STATUS.LOADING
        }
      case SCENARIO_ACTIONS.SET_SCENARIO_LIST:
        return {
          ...state,
          list: action.tree,
          status: SCENARIO_STATUS.SUCCESS
        }
      default:
        return state
    }
  },
  currentScenario: (
    state = {
      scenario: null,
      status: SCENARIO_STATUS.IDLE
    },
    action
  ) => {
    switch (action.type) {
      case SCENARIO_ACTIONS.GET_CURRENT_SCENARIO:
        return {
          ...state,
          status: SCENARIO_STATUS.LOADING
        }
      case SCENARIO_ACTIONS.SET_CURRENT_SCENARIO:
        return {
          ...state,
          scenario:
                    action.scenario === null
                      ? null
                      : { ...state.scenario, ...action.scenario },
          status: SCENARIO_STATUS.SUCCESS
        }
      default:
        return state
    }
  }
})
