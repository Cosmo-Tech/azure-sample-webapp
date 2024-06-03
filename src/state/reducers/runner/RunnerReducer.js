// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Current Simulation Runner
import { createReducer } from '@reduxjs/toolkit';
import { RunnersUtils } from '../../../utils';
import { STATUSES } from '../../commons/Constants';
import { RUNNER_ACTIONS_KEY } from '../../commons/RunnerConstants';

// Runners List

export const runnersInitialState = {
  list: {
    data: null,
  },
  current: {
    data: null,
    status: STATUSES.IDLE,
  },
  runs: [],
  status: STATUSES.IDLE,
};

export const runnerReducer = createReducer(runnersInitialState, (builder) => {
  builder
    .addCase(RUNNER_ACTIONS_KEY.GET_ALL_SIMULATION_RUNNERS, (state, action) => {
      state.status = STATUSES.LOADING;
    })
    .addCase(RUNNER_ACTIONS_KEY.SET_ALL_SIMULATION_RUNNERS, (state, action) => {
      state.list.data = action.list;
      state.status = action.status;
    })
    .addCase(RUNNER_ACTIONS_KEY.UPDATE_RUNNER, (state, action) => {
      if (action.runner) {
        state.list.data = state.list?.data?.map((runnerData) => {
          if (runnerData.id === action.runnerId) {
            return {
              ...runnerData,
              ...action.runner,
            };
          }
          // Otherwise, use the original data
          return runnerData;
        });
        if (state.current?.data?.id === action.runnerId) {
          state.current.data = {
            ...state.current?.data,
            ...action.runner,
          };
        }
      }
      if (action.status) {
        state.current.status = action.status;
      }
    })
    .addCase(RUNNER_ACTIONS_KEY.SET_RUNNER_VALIDATION_STATUS, (state, action) => {
      state.list.data = state.list.data?.map((runner) => {
        if (runner.id === action.runnerId) {
          return { ...runner, validationStatus: action.validationStatus };
        }
        return runner;
      });
      if (state.current.data?.id === action.runnerId) {
        state.current.data = {
          ...state.current?.data,
          validationStatus: action.validationStatus,
        };
      }
    })
    .addCase(RUNNER_ACTIONS_KEY.SET_RUNNER_SECURITY, (state, action) => {
      state.list.data = state.list?.data?.map((runner) => {
        if (runner.id === action.runnerId) {
          const runnerWithNewSecurity = { ...runner, security: action.security };
          RunnersUtils.patchRunnerWithCurrentUserPermissions(
            runnerWithNewSecurity,
            action.userEmail,
            action.userId,
            action.runnersPermissionsMapping
          );
          return { ...runner, security: runnerWithNewSecurity.security };
        }
        return runner;
      });
      if (state.current?.data?.id === action.runnerId) {
        const runnerWithNewSecurity = { ...state.current.data, security: action.security };
        RunnersUtils.patchRunnerWithCurrentUserPermissions(
          runnerWithNewSecurity,
          action.userEmail,
          action.userId,
          action.runnersPermissionsMapping
        );
        state.current.data = runnerWithNewSecurity;
      }
    })
    .addCase(RUNNER_ACTIONS_KEY.SET_RUNNER_NAME, (state, action) => {
      state.list.data = state.list.data?.map((runnerData) => {
        if (runnerData.id === action.runnerId) {
          return { ...runnerData, name: action.name };
        }
        return runnerData;
      });
    })
    .addCase(RUNNER_ACTIONS_KEY.DELETE_RUNNER, (state, action) => {
      const index = state.list?.data.findIndex((runner) => runner.id === action.runnerId);
      state.list?.data.splice(index, 1);
      if (state.current.data?.id === action.runnerId) state.current.data = null;
    })
    .addCase(RUNNER_ACTIONS_KEY.ADD_RUNNER, (state, action) => {
      delete action.type;
      state.list?.data.push(action.data);
    })
    .addCase(RUNNER_ACTIONS_KEY.RESET_CURRENT_SIMULATION_RUNNER, (state) => {
      state.current.data = null;
      state.current.status = STATUSES.IDLE;
    })
    .addCase(RUNNER_ACTIONS_KEY.SET_CURRENT_SIMULATION_RUNNER, (state, action) => {
      state.current.data = state.list.data.find((runner) => runner.id === action.runnerId) ?? state.current.data;
      state.current.status = action.status ?? state.current?.status;
    })
    .addCase(RUNNER_ACTIONS_KEY.UPDATE_RUNNER, (state, action) => {
      // Replace state and lastRunId in data if the runner to update is currently selected
      if (state.data?.id === action.data.runnerId) {
        state.data = {
          ...state.data,
          state: action.data.runnerState ?? state.data.state,
          lastRunId: action.data.lastRunId ?? state.data.lastRunId,
        };
      }
    })
    .addCase(RUNNER_ACTIONS_KEY.SET_RUNNER_VALIDATION_STATUS, (state, action) => {
      if (state.data?.id === action.runnerId) {
        state.data = {
          ...state.data,
          validationStatus: action.validationStatus,
        };
      }
    })
    .addCase(RUNNER_ACTIONS_KEY.SET_RUNNER_SECURITY, (state, action) => {
      if (state.data?.id === action.runnerId) {
        const runnerWithNewSecurity = { ...state.data, security: action.security };
        RunnersUtils.patchRunnerWithCurrentUserPermissions(
          runnerWithNewSecurity,
          action.userEmail,
          action.userId,
          action.runnersPermissionsMapping
        );
        state.data = {
          ...state.data,
          security: runnerWithNewSecurity.security,
        };
      }
    });
});
export const runnerReducer = combineReducers({
  list: runnersListReducer,
  current: currentSimulationRunnerReducer,
});
