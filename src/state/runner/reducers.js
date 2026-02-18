// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// Current Simulation Runner
import { createSlice } from '@reduxjs/toolkit';
import { STATUSES } from '../../services/config/StatusConstants';
import { RunnersUtils } from '../../utils';
import { addOrUpdateDatasetPart, deleteDatasetPart } from '../datasets/reducers';

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

      let runners = state.simulationRunners.list?.data;
      let index = runners.findIndex((runner) => runner.id === runnerId);
      if (index === -1) {
        runners = state.etlRunners.list?.data;
        index = runners.findIndex((runner) => runner.id === runnerId);
        if (index === -1) return; // Runner not stored in redux
      }

      RunnersUtils.updateParentIdOnDelete(runners, runnerId);
      runners.splice(index, 1);

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
      const { runner } = action.payload;
      state.etlRunners.list.data.push(runner);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOrUpdateDatasetPart, (state, action) => {
        const { runnerId, datasetPart: newDatasetPart } = action.payload;
        if (!runnerId) return; // This action can be called without runner id, to update datasets in redux

        if (!newDatasetPart) {
          console.warn('No runner id or no dataset part id provided');
          return;
        }

        const runner =
          state.simulationRunners.list.data?.find((runner) => runner.id === runnerId) ??
          state.etlRunners.list.data?.find((runner) => runner.id === runnerId);
        if (!runner) {
          console.warn(`Can't add or update dataset part: no runner found with id "${runnerId}"`);
          return;
        }

        // TODO: factorize code with the addOrUpdateDatasetPart action in the dataset reducer
        runner.datasets.parameters = runner.datasets.parameters.filter((part) => part.id !== newDatasetPart.id);

        let found = false;
        runner.datasets.parameters = runner.datasets.parameters.map((datasetPart) => {
          if (datasetPart.name !== newDatasetPart.name) return datasetPart;

          found = true;
          return newDatasetPart;
        });
        if (!found) runner.datasets.parameters.push(newDatasetPart);

        if (state.simulationRunners.current?.data?.id === runnerId) {
          state.simulationRunners.current.data = {
            ...state.simulationRunners.current?.data,
            ...runner,
          };
        }
      })
      .addCase(deleteDatasetPart, (state, action) => {
        const { runnerId, datasetPartId: partIdToDelete } = action.payload;
        if (!runnerId) return; // This action can be called without runner id, to delete datasets in redux

        if (!partIdToDelete) {
          console.warn('No runner id or no dataset part id provided');
          return;
        }

        const runner =
          state.simulationRunners.list.data?.find((runner) => runner.id === runnerId) ??
          state.etlRunners.list.data?.find((runner) => runner.id === runnerId);
        if (!runner) {
          console.warn(`Can't delete dataset part: no runner found with id "${runnerId}"`);
          return;
        }

        runner.datasets.parameters = runner.datasets.parameters.filter((part) => part.id !== partIdToDelete);

        if (state.simulationRunners.current?.data?.id === runnerId) {
          state.simulationRunners.current.data = {
            ...state.simulationRunners.current?.data,
            ...runner,
          };
        }
      });
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
