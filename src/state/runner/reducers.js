// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Current Simulation Runner
import { createSlice } from '@reduxjs/toolkit';
import { STATUSES } from '../../services/config/StatusConstants';
import { RunnersUtils } from '../../utils';

export const runnersInitialState = {
  list: {
    data: null,
    status: STATUSES.IDLE,
  },
  current: {
    data: null,
    status: STATUSES.IDLE,
  },
  runs: [],
  status: STATUSES.IDLE,
};

const runnerSlice = createSlice({
  name: 'runner',
  initialState: runnersInitialState,
  reducers: {
    setAllSimulationRunners: (state, action) => {
      const { list, status } = action.payload;
      state.list.data = list;
      state.status = status;
    },
    setReducerStatus: (state, action) => {
      const { status } = action.payload;
      state.status = status;
    },
    updateRunner: (state, action) => {
      const { runner, runnerId, status } = action.payload;
      if (runner) {
        state.list.data = state.list?.data?.map((runnerData) => {
          if (runnerData.id === runnerId) {
            return {
              ...runnerData,
              ...runner,
            };
          }
          // Otherwise, use the original data
          return runnerData;
        });
        if (state.current?.data?.id === runnerId) {
          state.current.data = {
            ...state.current?.data,
            ...runner,
          };
        }
      }
      if (status) {
        state.current.status = status;
      }
    },
    setValidationStatus: (state, action) => {
      const { runnerId, validationStatus } = action.payload;
      state.list.data = state.list.data?.map((runner) => {
        if (runner.id === runnerId) {
          return { ...runner, validationStatus };
        }
        return runner;
      });
      if (state.current.data?.id === runnerId) {
        state.current.data = {
          ...state.current?.data,
          validationStatus,
        };
      }
    },
    setRunnerSecurity: (state, action) => {
      const { runnerId, security, userEmail, userId, runnersPermissionsMapping } = action.payload;
      state.list.data = state.list?.data?.map((runner) => {
        if (runner.id === runnerId) {
          const runnerWithNewSecurity = { ...runner, security };
          RunnersUtils.patchRunnerWithCurrentUserPermissions(
            runnerWithNewSecurity,
            userEmail,
            userId,
            runnersPermissionsMapping
          );
          return { ...runner, security: runnerWithNewSecurity.security };
        }
        return runner;
      });
      if (state.current?.data?.id === runnerId) {
        const runnerWithNewSecurity = { ...state.current.data, security };
        RunnersUtils.patchRunnerWithCurrentUserPermissions(
          runnerWithNewSecurity,
          userEmail,
          userId,
          runnersPermissionsMapping
        );
        state.current.data = runnerWithNewSecurity;
      }
    },
    setRunnerName: (state, action) => {
      const { runnerId, name } = action.payload;
      state.list.data = state.list.data?.map((runnerData) => {
        if (runnerData.id === runnerId) {
          return { ...runnerData, name };
        }
        return runnerData;
      });
    },
    deleteRunner: (state, action) => {
      const { runnerId } = action.payload;
      const index = state.list?.data.findIndex((runner) => runner.id === runnerId);
      RunnersUtils.updateParentIdOnDelete(state.list?.data, runnerId);
      state.list?.data.splice(index, 1);
      if (state.current.data?.id === runnerId) state.current.data = null;
    },
    addRunner: (state, action) => {
      const { data } = action.payload;
      state.list?.data.push(data);
    },
    resetCurrentSimulationRunner: (state) => {
      state.current.data = null;
      state.current.status = STATUSES.IDLE;
    },
    setCurrentSimulationRunner: (state, action) => {
      const { runnerId, status } = action.payload;
      state.current.data = state.list.data.find((runner) => runner.id === runnerId) ?? state.current.data;
      state.current.status = status ?? state.current?.status;
    },
    addRun: (state, action) => {
      const { data } = action.payload;
      state.runs.push(data);
    },
    updateRun: (state, action) => {
      const { data } = action.payload;
      state.runs = state.runs.map((run) => {
        if (run.id === data.id) {
          return {
            ...run,
            ...data,
          };
        }
        return run;
      });
    },
    setListStatus: (state, action) => {
      const { status } = action.payload;
      state.list.status = status;
    },
  },
});
export const {
  setAllSimulationRunners,
  setReducerStatus,
  updateRunner,
  setValidationStatus,
  setRunnerSecurity,
  setRunnerName,
  deleteRunner,
  addRunner,
  resetCurrentSimulationRunner,
  setCurrentSimulationRunner,
  addRun,
  updateRun,
  setListStatus,
} = runnerSlice.actions;
export default runnerSlice.reducer;
