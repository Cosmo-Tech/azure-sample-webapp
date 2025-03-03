// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RunnersUtils } from '../../utils';
import { useOrganizationId } from '../organizations/hooks';
import { useWorkspaceId } from '../workspaces/hooks';
import {
  dispatchApplyRunnerSharingChanges,
  dispatchCreateRunner,
  dispatchCreateSimulationRunner,
  dispatchDeleteRunner,
  dispatchGetRunner,
  dispatchRenameRunner,
  dispatchStartRunner,
  dispatchStopRunner,
  dispatchStopSimulationRunner,
  dispatchUpdateAndStartRunner,
  dispatchUpdateSimulationRunner,
  dispatchUpdateSimulationRunnerData,
} from './dispatchers';
import { resetCurrentSimulationRunner, setCurrentSimulationRunner, setValidationStatus } from './reducers';

export const useRunnersReducerStatus = () => {
  return useSelector((state) => state.runner?.status);
};

export const useRunnersListStatus = () => {
  return useSelector((state) => state.runner.simulationRunners.list?.status);
};

export const useRunners = () => {
  return useSelector((state) => state.runner?.simulationRunners.list?.data);
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
  return useSelector((state) => state.runner.simulationRunners.current?.data?.lastUpdate);
};

export const useCurrentSimulationRunnerLastRunId = () => {
  return useSelector((state) => RunnersUtils.getLastRunId(state.runner.simulationRunners.current?.data));
};

export const useCurrentSimulationRunnerState = () => {
  return useSelector((state) => state.runner.simulationRunners.current?.data?.state);
};

export const useCurrentSimulationRunnerDatasetList = () => {
  return useSelector((state) => state.runner.simulationRunners.current?.data?.datasetList);
};

export const useCurrentSimulationRunnerReducerStatus = () => {
  return useSelector((state) => state.runner?.simulationRunners.current?.status);
};

export const useLastRunsList = () => {
  return useSelector((state) => state.runner?.runs);
};

export const useCurrentSimulationRunnerLastRun = (runnerId) => {
  return useLastRunsList().find((run) => run.runnerId === runnerId);
};

export const useCreateRunner = () => {
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const dispatch = useDispatch();
  return useCallback(
    (runner) => dispatch(dispatchCreateRunner(organizationId, workspaceId, runner)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useCreateSimulationRunner = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (runner) => dispatch(dispatchCreateSimulationRunner(organizationId, workspaceId, runner)),
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
export const useStopRunner = () => {
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const dispatch = useDispatch();
  return useCallback(
    (datasetId) => dispatch(dispatchStopRunner(organizationId, workspaceId, datasetId)),
    [dispatch, organizationId, workspaceId]
  );
};

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
