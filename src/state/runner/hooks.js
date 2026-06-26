// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STATUSES } from '../../services/config/StatusConstants';
import { RunnersUtils } from '../../utils';
import { useOrganizationId } from '../organizations/hooks';
import { useWorkspaceId } from '../workspaces/hooks';
import {
  dispatchApplyRunnerSharingChanges,
  dispatchCreateETLRunnerAndDataset,
  dispatchCreateSimulationRunner,
  dispatchDeleteRunner,
  dispatchGetRunner,
  dispatchRenameRunner,
  dispatchStartRunner,
  dispatchStopETLRunner,
  dispatchStopSimulationRunner,
  dispatchUpdateAndStartRunner,
  dispatchUpdateEtlRunner,
  dispatchUpdateSimulationRunner,
  dispatchUpdateSimulationRunnerData,
  dispatchStartRunnerStatusPolling,
  dispatchStopAllRunnerStatusPolling,
} from './dispatchers';
import {
  resetCurrentSimulationRunner,
  setCurrentSimulationRunner,
  setValidationStatus,
  updateSimulationRunner,
} from './reducers';
import { asyncUpdateRunner } from './sagas/UpdateSimulationRunner.js';

export const useRunnersReducerStatus = () => {
  return useSelector((state) => state.runner?.status);
};

export const useRunnersListStatus = () => {
  return useSelector((state) => state.runner.simulationRunners.list?.status);
};

export const useRunners = () => {
  return useSelector((state) => state.runner?.simulationRunners.list?.data);
};

export const useGetRunnerById = () => {
  const runners = useRunners();
  return useCallback((runnerId) => runners && runners.find((runner) => runner.id === runnerId), [runners]);
};

export const useGetETLRunnerById = () => {
  const runners = useGetETLRunners();
  return useCallback((runnerId) => runners && runners.find((runner) => runner.id === runnerId), [runners]);
};

export const useCurrentSimulationRunner = () => {
  return useSelector((state) => state.runner.simulationRunners.current);
};

export const useCurrentSimulationRunnerRunTemplateId = () => {
  return useSelector((state) => state.runner?.simulationRunners.current?.data?.runTemplateId);
};

export const useCurrentSimulationRunnerData = () => {
  return useSelector((state) => state.runner.simulationRunners.current?.data);
};

export const useCurrentSimulationRunnerId = () => {
  return useSelector((state) => state.runner.simulationRunners.current?.data?.id);
};

export const useCurrentSimulationRunnerParametersValues = () => {
  return useSelector((state) => state.runner.simulationRunners.current?.data?.parametersValues);
};

export const useCurrentSimulationRunnerLastUpdate = () => {
  return useSelector((state) => state.runner.simulationRunners.current?.data?.updateInfo?.timestamp);
};

export const useCurrentSimulationRunnerLastRunId = () => {
  return useSelector((state) => RunnersUtils.getLastRunId(state.runner.simulationRunners.current?.data));
};

export const useCurrentSimulationRunnerLastRunStatus = () => {
  return useSelector((state) => RunnersUtils.getLastRunStatus(state.runner.simulationRunners.current?.data));
};

export const useCurrentSimulationRunnerBaseDatasetIds = () => {
  return useSelector((state) => state.runner.simulationRunners.current?.data?.datasets?.bases);
};

export const useCurrentSimulationRunnerReducerStatus = () => {
  return useSelector((state) => state.runner?.simulationRunners.current?.status);
};

export const useRunDetails = () => {
  return useSelector((state) => state.runner?.runDetails);
};

export const useCurrentSimulationRunnerLastRunDetails = (runnerId) => {
  const runDetails = useRunDetails().filter((run) => run.runnerId === runnerId);
  // New runs may have no startTime when added in redux after their creation. If such a run is found, it is the last run
  const runWithNoStartTime = runDetails.find((run) => !run.startTime);
  if (runWithNoStartTime) return runWithNoStartTime;
  // Otherwise, sort the list to find the most recent startTime
  return runDetails.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0];
};

export const useCreateETLRunnerAndDataset = () => {
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const dispatch = useDispatch();
  return useCallback(
    (runner) => dispatch(dispatchCreateETLRunnerAndDataset(organizationId, workspaceId, runner)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useCreateSimulationRunner = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (runner) => {
      if (runner.datasetList != null) runner.datasetList = runner?.datasetList?.filter((item) => item != null);
      dispatch(dispatchCreateSimulationRunner(organizationId, workspaceId, runner));
    },
    [dispatch, organizationId, workspaceId]
  );
};

export const useGetRunner = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (runnerId) => dispatch(dispatchGetRunner(organizationId, workspaceId, runnerId)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useSelectRunner = () => {
  const dispatch = useDispatch();
  return useCallback((runnerId) => dispatch(setCurrentSimulationRunner({ runnerId })), [dispatch]);
};
export const useStopETLRunner = () => {
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const dispatch = useDispatch();
  return useCallback(
    (datasetId) => dispatch(dispatchStopETLRunner(organizationId, workspaceId, datasetId)),
    [dispatch, organizationId, workspaceId]
  );
};

// Update the state of a given simulation runner in redux, without any API calls (simple call to the reducer)
export const useUpdateSimulationRunnerInRedux = () => {
  const dispatch = useDispatch();
  return useCallback((payload) => dispatch(updateSimulationRunner(payload)), [dispatch]);
};
// Starts a saga with API calls to update a simulation runner
export const useUpdateSimulationRunner = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const runTemplateId = useCurrentSimulationRunnerRunTemplateId();
  return useCallback(
    (runnerId, runnerParameters) =>
      dispatch(dispatchUpdateSimulationRunner(organizationId, workspaceId, runnerId, runTemplateId, runnerParameters)),
    [dispatch, organizationId, workspaceId, runTemplateId]
  );
};
// useAsyncUpdateSimulationRunner is similar to useUpdateSimulationRunner, but using an async call to the API instead of
// going through redux dispatchers. It can thus be used in component hooks with "await" to chain multiple calls to the
// API (e.g. "save & launch" button)
export const useAsyncUpdateSimulationRunner = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const runTemplateId = useCurrentSimulationRunnerRunTemplateId();
  return useCallback(
    async (runnerId, runnerParameters, runnerStatusOnSuccess = STATUSES.SUCCESS) => {
      dispatch(updateSimulationRunner({ runnerId, status: STATUSES.SAVING }));
      try {
        const updatedRunner = await asyncUpdateRunner(
          organizationId,
          workspaceId,
          runnerId,
          runTemplateId,
          runnerParameters
        );
        dispatch(updateSimulationRunner({ status: runnerStatusOnSuccess, runnerId, runner: updatedRunner }));
      } catch (error) {
        dispatch(updateSimulationRunner({ runnerId, status: STATUSES.ERROR }));
      }
    },
    [dispatch, organizationId, workspaceId, runTemplateId]
  );
};

export const useUpdateRunnerData = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (runnerId, runnerDataPatch) =>
      dispatch(dispatchUpdateSimulationRunnerData(organizationId, workspaceId, runnerId, runnerDataPatch)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useUpdateCurrentSimulationRunner = () => {
  const dispatch = useDispatch();
  return useCallback((runner) => dispatch(setCurrentSimulationRunner({ runner })), [dispatch]);
};

export const useStartRunner = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (runnerId) => dispatch(dispatchStartRunner(organizationId, workspaceId, runnerId)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useUpdateAndStartRunner = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const runTemplateId = useCurrentSimulationRunnerRunTemplateId();
  return useCallback(
    (runnerId, runnerParameters) =>
      dispatch(dispatchUpdateAndStartRunner(organizationId, workspaceId, runnerId, runTemplateId, runnerParameters)),
    [dispatch, organizationId, workspaceId, runTemplateId]
  );
};

export const useRenameRunner = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (runnerId, runTemplateId, newRunnerName) =>
      dispatch(dispatchRenameRunner(organizationId, workspaceId, runnerId, runTemplateId, newRunnerName)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useApplyRunnerSharingSecurity = () => {
  const dispatch = useDispatch();
  return useCallback(
    (runnerId, security) => dispatch(dispatchApplyRunnerSharingChanges(runnerId, security)),
    [dispatch]
  );
};

export const useDeleteRunner = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (runnerId) => dispatch(dispatchDeleteRunner(organizationId, workspaceId, runnerId)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useResetCurrentSimulationRunner = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(resetCurrentSimulationRunner()), [dispatch]);
};

export const useSetSimulationRunnerValidationStatus = () => {
  const dispatch = useDispatch();
  return useCallback(
    (runnerId, validationStatus) => dispatch(setValidationStatus({ runnerId, validationStatus })),
    [dispatch]
  );
};

export const useStopSimulationRunner = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (runnerId) => dispatch(dispatchStopSimulationRunner(organizationId, workspaceId, runnerId)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useGetETLRunners = () => {
  return useSelector((state) => state.runner.etlRunners?.list?.data);
};

export const useUpdateEtlRunner = () => {
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const dispatch = useDispatch();
  return useCallback(
    (runnerId, dataset, runnerPatch) =>
      dispatch(dispatchUpdateEtlRunner(organizationId, workspaceId, runnerId, dataset, runnerPatch)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useStartRunnerStatusPolling = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (runnerId, lastRunId, delayFirstCall) =>
      dispatch(dispatchStartRunnerStatusPolling(organizationId, workspaceId, runnerId, lastRunId, delayFirstCall)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useStopAllRunnerStatusPolling = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchStopAllRunnerStatusPolling()), [dispatch]);
};
