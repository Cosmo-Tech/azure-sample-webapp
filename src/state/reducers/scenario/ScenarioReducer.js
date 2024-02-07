// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { createReducer } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { ScenariosUtils } from '../../../utils';
import { STATUSES } from '../../commons/Constants';
import { SCENARIO_ACTIONS_KEY } from '../../commons/ScenarioConstants';

// Scenario List

export const scenarioListInitialState = {
  data: [],
  status: STATUSES.IDLE,
};

export const scenarioListReducer = createReducer(scenarioListInitialState, (builder) => {
  builder
    .addCase(SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS, (state, action) => {
      state.status = STATUSES.LOADING;
    })
    .addCase(SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS, (state, action) => {
      state.data = action.list;
      state.status = action.status;
    })
    .addCase(SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO, (state, action) => {
      state.data = state.data?.map((scenarioData) => {
        // Replace state and lastRun in data for the scenario to update
        if (scenarioData.id === action.data.scenarioId) {
          return {
            ...scenarioData,
            state: action.data.scenarioState ?? scenarioData.state,
            lastRun: action.data.lastRun ?? scenarioData.lastRun,
          };
        }
        // Otherwise, use the original data
        return scenarioData;
      });
    })
    .addCase(SCENARIO_ACTIONS_KEY.SET_SCENARIO_VALIDATION_STATUS, (state, action) => {
      state.data = state.data?.map((scenarioData) => {
        if (scenarioData.id === action.scenarioId) {
          return { ...scenarioData, validationStatus: action.validationStatus };
        }
        return scenarioData;
      });
    })
    .addCase(SCENARIO_ACTIONS_KEY.SET_SCENARIO_SECURITY, (state, action) => {
      state.data = state.data?.map((scenarioData) => {
        if (scenarioData.id === action.scenarioId) {
          const scenarioWithNewSecurity = { ...scenarioData, security: action.security };
          ScenariosUtils.patchScenarioWithCurrentUserPermissions(
            scenarioWithNewSecurity,
            action.userEmail,
            action.userId,
            action.scenariosPermissionsMapping
          );
          return { ...scenarioData, security: scenarioWithNewSecurity.security };
        }
        return scenarioData;
      });
    })
    .addCase(SCENARIO_ACTIONS_KEY.SET_SCENARIO_NAME, (state, action) => {
      state.data = state.data?.map((scenarioData) => {
        if (scenarioData.id === action.scenarioId) {
          return { ...scenarioData, name: action.name };
        }
        return scenarioData;
      });
    });
});

// Current Scenario

export const currentScenarioInitialState = {
  data: null,
  status: STATUSES.IDLE,
};

export const currentScenarioReducer = createReducer(currentScenarioInitialState, (builder) => {
  builder
    .addCase(SCENARIO_ACTIONS_KEY.RESET_CURRENT_SCENARIO, (state) => {
      state.data = null;
      state.status = STATUSES.IDLE;
    })
    .addCase(SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, (state, action) => {
      if ((state.data !== null && action.scenario !== null) || (state.data === null && action.scenario != null)) {
        state.data = {
          ...state.data,
          ...action.scenario,
        };
      } else {
        state.data = null;
      }
      state.status = action.status ?? state.status;
    })
    .addCase(SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO, (state, action) => {
      // Replace state and lastRun in data if the scenario to update is currently selected
      if (state.data?.id === action.data.scenarioId) {
        state.data = {
          ...state.data,
          state: action.data.scenarioState ?? state.data.state,
          lastRun: action.data.lastRun ?? state.data.lastRun,
        };
      }
    })
    .addCase(SCENARIO_ACTIONS_KEY.SET_SCENARIO_VALIDATION_STATUS, (state, action) => {
      if (state.data?.id === action.scenarioId) {
        state.data = {
          ...state.data,
          validationStatus: action.validationStatus,
        };
      }
    })
    .addCase(SCENARIO_ACTIONS_KEY.SET_SCENARIO_SECURITY, (state, action) => {
      if (state.data?.id === action.scenarioId) {
        const scenarioWithNewSecurity = { ...state.data, security: action.security };
        ScenariosUtils.patchScenarioWithCurrentUserPermissions(
          scenarioWithNewSecurity,
          action.userEmail,
          action.userId,
          action.scenariosPermissionsMapping
        );
        state.data = {
          ...state.data,
          security: scenarioWithNewSecurity.security,
        };
      }
    });
});

export const scenarioReducer = combineReducers({
  list: scenarioListReducer,
  current: currentScenarioReducer,
});
