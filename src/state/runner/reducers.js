// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Current Simulation Runner
import { createSlice } from '@reduxjs/toolkit';
import { STATUSES } from '../../services/config/StatusConstants';
import { RunnersUtils } from '../../utils';

export const runnersInitialState = {
  simulationRunners: {
    list: {
      data: null,
      status: STATUSES.IDLE,
    },
    current: {
      data: null,
      status: STATUSES.IDLE,
    },
  },
  etlRunners: {
    list: {
      data: [],
    },
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
      state.simulationRunners.list.data = list;
      state.simulationRunners.list.status = status;
    },
    setReducerStatus: (state, action) => {
      const { status } = action.payload;
      state.status = status;
    },
    updateSimulationRunner: (state, action) => {
      const { runner, runnerId, status } = action.payload;
      if (runner) {
        state.simulationRunners.list.data = state.simulationRunners.list?.data?.map((runnerData) => {
          if (runnerData.id === runnerId) {
            return {
              ...runnerData,
              ...runner,
            };
          }
          // Otherwise, use the original data
          return runnerData;
        });
        if (state.simulationRunners.current?.data?.id === runnerId) {
          state.simulationRunners.current.data = {
            ...state.simulationRunners.current?.data,
            ...runner,
          };
        }
      }
      if (status) {
        state.simulationRunners.current.status = status;
      }
    },
    setValidationStatus: (state, action) => {
      const { runnerId, validationStatus } = action.payload;
      state.simulationRunners.list.data = state.simulationRunners.list.data?.map((runner) => {
        if (runner.id === runnerId) {
          return { ...runner, validationStatus };
        }
        return runner;
      });
      if (state.simulationRunners.current.data?.id === runnerId) {
        state.simulationRunners.current.data = {
          ...state.simulationRunners.current?.data,
          validationStatus,
        };
      }
    },
    setRunnerSecurity: (state, action) => {
      const { runnerId, security, userEmail, userId, runnersPermissionsMapping } = action.payload;
      state.simulationRunners.list.data = state.simulationRunners.list?.data?.map((runner) => {
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
      if (state.simulationRunners.current?.data?.id === runnerId) {
        const runnerWithNewSecurity = { ...state.simulationRunners.current.data, security };
        RunnersUtils.patchRunnerWithCurrentUserPermissions(
          runnerWithNewSecurity,
          userEmail,
          userId,
          runnersPermissionsMapping
        );
        state.simulationRunners.current.data = runnerWithNewSecurity;
      }
    },
    setRunnerName: (state, action) => {
      const { runnerId, name } = action.payload;
      state.simulationRunners.list.data = state.simulationRunners.list.data?.map((runnerData) => {
        if (runnerData.id === runnerId) {
          return { ...runnerData, name };
        }
        return runnerData;
      });
    },
    deleteRunner: (state, action) => {
      const { runnerId } = action.payload;
      const index = state.simulationRunners.list?.data.findIndex((runner) => runner.id === runnerId);
      RunnersUtils.updateParentIdOnDelete(state.simulationRunners.list?.data, runnerId);
      state.simulationRunners.list?.data.splice(index, 1);
      if (state.simulationRunners.current.data?.id === runnerId) state.simulationRunners.current.data = null;
    },
    addSimulationRunner: (state, action) => {
      const { data } = action.payload;
      state.simulationRunners.list?.data.push(data);
    },
    resetCurrentSimulationRunner: (state) => {
      state.simulationRunners.current.data = null;
      state.simulationRunners.current.status = STATUSES.IDLE;
    },
    setCurrentSimulationRunner: (state, action) => {
      const { runnerId, status } = action.payload;
      state.simulationRunners.current.data =
        state.simulationRunners.list.data.find((runner) => runner.id === runnerId) ??
        state.simulationRunners.current.data;
      state.simulationRunners.current.status = status ?? state.simulationRunners.current?.status;
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
      state.simulationRunners.list.status = status;
    },
    setAllEtlRunners: (state, action) => {
      const { list, status } = action.payload;
      state.etlRunners.list.data = list;
      state.etlRunners.list.status = status;
    },
    updateEtlRunner: (state, action) => {
      const { runnerId, runner } = action.payload;
      if (runner)
        state.etlRunners.list.data = state.etlRunners.list.data?.map((runnerData) => {
          if (runnerData.id === runnerId) {
            return { ...runnerData, ...runner };
          }
          return runnerData;
        });
    },
    addEtlRunner: (state, action) => {
      const runner = action.runner;
      state.etlRunners.list.data.push(runner);
    },
  },
});
export const {
  setAllSimulationRunners,
  setReducerStatus,
  updateSimulationRunner,
  setValidationStatus,
  setRunnerSecurity,
  setRunnerName,
  deleteRunner,
  addSimulationRunner,
  resetCurrentSimulationRunner,
  setCurrentSimulationRunner,
  addRun,
  updateRun,
  setListStatus,
  setAllEtlRunners,
  updateEtlRunner,
  addEtlRunner,
} = runnerSlice.actions;
export default runnerSlice.reducer;
