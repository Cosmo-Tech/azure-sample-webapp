// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOrganizationId } from './OrganizationHooks';
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
  dispatchSaveScenario,
  dispatchSaveAndLaunchScenario,
  dispatchLaunchScenario,
} from '../dispatchers/scenario/ScenarioDispatcher';

export const useScenarioList = () => {
  return useSelector((state) => state.scenario.list);
};

export const useScenarioListData = () => {
  return useSelector((state) => state.scenario?.list?.data);
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
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenarioId) => dispatch(dispatchFindScenarioById(organizationId, workspaceId, scenarioId)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useCreateScenario = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenario) => dispatch(dispatchCreateScenario(organizationId, workspaceId, scenario)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useDeleteScenario = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenario) => dispatch(dispatchDeleteScenario(organizationId, workspaceId, scenario)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useRenameScenario = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenario, newScenarioName) =>
      dispatch(dispatchRenameScenario(organizationId, workspaceId, scenario, newScenarioName)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useUpdateCurrentScenario = () => {
  const dispatch = useDispatch();
  return useCallback((scenario) => dispatch(dispatchSetCurrentScenario(scenario)), [dispatch]);
};

export const useSaveScenario = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenarioId, scenarioParameters) =>
      dispatch(dispatchSaveScenario(organizationId, workspaceId, scenarioId, scenarioParameters)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useLaunchScenario = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenarioId) => dispatch(dispatchLaunchScenario(organizationId, workspaceId, scenarioId)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useSaveAndLaunchScenario = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  return useCallback(
    (scenarioId, scenarioParameters) =>
      dispatch(dispatchSaveAndLaunchScenario(organizationId, workspaceId, scenarioId, scenarioParameters)),
    [dispatch, organizationId, workspaceId]
  );
};
