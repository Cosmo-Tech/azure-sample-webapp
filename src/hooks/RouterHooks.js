// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams, useBlocker } from 'react-router-dom';
import { TwoActionsDialogService } from '../services/twoActionsDialog/twoActionsDialogService';
import { useFindScenarioById, useCurrentScenarioId } from '../state/hooks/ScenarioHooks';
import { useWorkspaceData } from '../state/hooks/WorkspaceHooks';
import { ConfigUtils } from '../utils';
import { useSortedScenarioList } from './ScenarioListHooks';

export const useRedirectFromDisabledView = (view) => {
  const isUnmounted = useRef(false);
  const currentWorkspaceData = useWorkspaceData();
  const navigate = useNavigate();
  const routerParameters = useParams();

  useEffect(() => {
    if (isUnmounted.current) {
      return;
    }
    let isViewEnabled;
    switch (view) {
      case 'instance':
        isViewEnabled = ConfigUtils.isInstanceViewConfigValid(currentWorkspaceData?.webApp?.options?.instanceView);
        break;
      case 'datasetManager':
        isViewEnabled = ConfigUtils.isDatasetManagerEnabledInWorkspace(currentWorkspaceData);
        break;
      case 'dashboards':
        isViewEnabled = ConfigUtils.isResultsDisplayEnabledInWorkspace(currentWorkspaceData);
        break;
      default:
        isViewEnabled = true;
    }
    if (isViewEnabled) return;
    const workspaceId = routerParameters.workspaceId;
    navigate(workspaceId ? `/${workspaceId}` : '/workspaces');
    return () => {
      isUnmounted.current = true;
    };
  }, [
    currentWorkspaceData?.webApp?.options?.charts,
    currentWorkspaceData?.webApp?.options?.instanceView,
    currentWorkspaceData?.webApp?.options?.datasetmanager,
    navigate,
    view,
    routerParameters.workspaceId,
    currentWorkspaceData,
  ]);
};

export const useRouterScenarioId = () => {
  const routerParameters = useParams();
  return routerParameters?.scenarioId;
};

export const useRedirectionToScenario = () => {
  const currentScenarioId = useCurrentScenarioId();

  const navigate = useNavigate();
  const handleScenarioChange = useFindScenarioById();
  const sortedScenarioList = useSortedScenarioList();

  const routerScenarioId = useRouterScenarioId();

  // no routerId and no current scenarioId > Navigate to the first scenario
  useEffect(() => {
    if (sortedScenarioList.length !== 0 && !routerScenarioId && !currentScenarioId) {
      navigate(sortedScenarioList[0].id);
    }
  }, [currentScenarioId, navigate, routerScenarioId, sortedScenarioList]);

  // on routerId change and not match to currentScenario
  // > change current scenario if routerid don't match
  // > navigate to default view if no scenario match
  const previousRouterScenarioId = useRef();
  useEffect(() => {
    if (
      routerScenarioId &&
      previousRouterScenarioId.current !== routerScenarioId &&
      currentScenarioId !== routerScenarioId
    ) {
      handleScenarioChange(routerScenarioId);

      if (!sortedScenarioList.some((s) => s.id === routerScenarioId)) {
        navigate('');
      }
    }
    previousRouterScenarioId.current = routerScenarioId;
  }, [currentScenarioId, handleScenarioChange, navigate, routerScenarioId, sortedScenarioList]);

  // on currentScenario change
  // > on load, if default view, add scenarioId to route
  // > after load, navigate to new scenario.
  const previousCurrentScenarioId = useRef(currentScenarioId);
  useEffect(() => {
    if (!routerScenarioId && currentScenarioId) {
      navigate(currentScenarioId, { replace: true });
    }

    if (
      currentScenarioId &&
      previousCurrentScenarioId.current !== currentScenarioId &&
      currentScenarioId !== routerScenarioId
    ) {
      navigate(currentScenarioId);
    }
    previousCurrentScenarioId.current = currentScenarioId;
  }, [currentScenarioId, navigate, routerScenarioId]);
};

export function useConfirmOnRouteChange(dialogProps, when) {
  const blocker = useBlocker(when);

  const callOnRouteChange = useCallback(async () => {
    const dialogResult = await TwoActionsDialogService.openDialog(dialogProps);
    dialogResult === 2 ? blocker.proceed() : blocker.reset();
  }, [blocker, dialogProps]);

  useEffect(() => {
    if (blocker.state === 'blocked') callOnRouteChange();
  }, [blocker.state, callOnRouteChange]);

  useEffect(() => {
    const confirmUnload = (event) => {
      if (sessionStorage.getItem('logoutInProgress') !== 'true' && when) {
        event.preventDefault();
        event.returnValue = dialogProps.body;
        return dialogProps.body;
      }
    };

    window.addEventListener('beforeunload', confirmUnload);

    return () => window.removeEventListener('beforeunload', confirmUnload);
  }, [dialogProps.body, when]);
}
