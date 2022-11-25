// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useWorkspaceId } from './WorkspaceHooks';

import {
  dispatchResetCurrentScenario,
  dispatchApplyScenarioSharingChanges,
  dispatchSetScenarioValidationStatus,
  dispatchFindScenarioById,
  dispatchCreateScenario,
  dispatchDeleteScenario,
  dispatchRenameScenario,
  dispatchSetCurrentScenario,
  dispatchUpdateAndLaunchScenario,
  dispatchLaunchScenario,
} from '../dispatchers/scenario/ScenarioDispatcher';

export const useScenarioList = () => {
  return useSelector((state) => state.scenario.list);
};

export const useCurrentScenario = () => {
  return useSelector((state) => state.scenario.current);
};

export const useCurrentScenarioData = () => {
  return useSelector((state) => state.scenario.current?.data);
};

export const useResetCurrentScenario = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchResetCurrentScenario()), [dispatch]);
};

export const useApplyScenarioSharingSecurity = () => {
  const dispatch = useDispatch();
  return useCallback(
    (scenarioId, security) => dispatch(dispatchApplyScenarioSharingChanges(scenarioId, security)),
    [dispatch]
  );
};

export const useSetScenarioValidationStatus = () => {
  const dispatch = useDispatch();
  return useCallback(
    (scenarioId, validationStatus) => dispatch(dispatchSetScenarioValidationStatus(scenarioId, validationStatus)),
    [dispatch]
  );
};

export const useFindScenarioById = () => {
  const dispatch = useDispatch();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenarioId) => dispatch(dispatchFindScenarioById(workspaceId, scenarioId)),
    [dispatch, workspaceId]
  );
};

export const useCreateScenario = () => {
  const dispatch = useDispatch();
  const workspaceId = useWorkspaceId();
  return useCallback((scenario) => dispatch(dispatchCreateScenario(workspaceId, scenario)), [dispatch, workspaceId]);
};

export const useDeleteScenario = () => {
  const dispatch = useDispatch();
  const workspaceId = useWorkspaceId();
  return useCallback((scenario) => dispatch(dispatchDeleteScenario(workspaceId, scenario)), [dispatch, workspaceId]);
};

export const useRenameScenario = () => {
  const dispatch = useDispatch();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenario, newScenarioName) => dispatch(dispatchRenameScenario(workspaceId, scenario, newScenarioName)),
    [dispatch, workspaceId]
  );
};

export const useUpdateCurrentScenario = () => {
  const dispatch = useDispatch();
  return useCallback((scenario) => dispatch(dispatchSetCurrentScenario(scenario)), [dispatch]);
};

export const useUpdateAndLaunchScenario = () => {
  const dispatch = useDispatch();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenarioId, scenarioParameters) =>
      dispatch(dispatchUpdateAndLaunchScenario(workspaceId, scenarioId, scenarioParameters)),
    [dispatch, workspaceId]
  );
};

export const useLaunchScenario = () => {
  const dispatch = useDispatch();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenarioId) => dispatch(dispatchLaunchScenario(workspaceId, scenarioId)),
    [dispatch, workspaceId]
  );
};
