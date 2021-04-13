// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { combineReducers } from 'redux'
import { SCENARIO_STATUS, SCENARIO_ACTIONS_KEY } from '../../commons/ScenarioConstants'

export const scenarioReducer = combineReducers({
  scenarioList: (
    state = {
      list: [],
      status: SCENARIO_STATUS.IDLE
    },
    action
  ) => {
    switch (action.type) {
      case SCENARIO_ACTIONS_KEY.GET_SCENARIO_LIST:
        return {
          ...state,
          status: SCENARIO_STATUS.LOADING
        }
      case SCENARIO_ACTIONS_KEY.SET_SCENARIO_LIST:
        return {
          ...state,
          list: action.list,
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
      case SCENARIO_ACTIONS_KEY.GET_CURRENT_SCENARIO:
        return {
          ...state,
          status: SCENARIO_STATUS.LOADING
        }
      case SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO:
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
