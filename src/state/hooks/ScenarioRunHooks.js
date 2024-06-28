// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  dispatchFetchScenarioRunById,
  dispatchStopScenarioRun,
} from '../dispatchers/scenarioRun/ScenarioRunDispatcher';
import { useOrganizationId } from './OrganizationHooks';
import { useCurrentSimulationRunnerLastRunId } from './RunnerHooks';
import { useWorkspaceId } from './WorkspaceHooks';

export const useScenarioRunsList = () => {
  return useSelector((state) => state.scenarioRun?.data);
};

export const useCurrentScenarioRun = () => {
  const currentScenarioRunId = useCurrentSimulationRunnerLastRunId();
  const scenarioRuns = useScenarioRunsList();

  return useMemo(() => {
    if (!currentScenarioRunId) return null;
    return scenarioRuns?.find((scenarioRun) => scenarioRun.id === currentScenarioRunId);
  }, [currentScenarioRunId, scenarioRuns]);
};

export const useCurrentScenarioRunStartTime = () => {
  const currentScenarioRun = useCurrentScenarioRun();
  return useMemo(() => currentScenarioRun?.status?.startTime, [currentScenarioRun]);
};

export const useFetchScenarioRunById = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  return useCallback(
    (scenarioRunId) => dispatch(dispatchFetchScenarioRunById(organizationId, scenarioRunId)),
    [dispatch, organizationId]
  );
};

export const useStopScenarioRun = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenarioId) => dispatch(dispatchStopScenarioRun(organizationId, workspaceId, scenarioId)),
    [dispatch, organizationId, workspaceId]
  );
};
