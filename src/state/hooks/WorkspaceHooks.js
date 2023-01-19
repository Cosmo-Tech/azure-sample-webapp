// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dispatchResetCurrentWorkspace, dispatchSelectWorkspace } from '../dispatchers/workspace/WorkspaceDispatcher';

export const useWorkspace = () => {
  return useSelector((state) => state.workspace.current);
};

export const useWorkspaceData = () => {
  return useSelector((state) => state.workspace.current?.data);
};

export const useWorkspaceId = () => {
  return useSelector((state) => state.workspace.current?.data?.id);
};

export const useWorkspaceCharts = () => {
  return useSelector((state) => state.workspace.current?.data?.webApp?.options?.charts);
};
export const useWorkspaceChartsWorkspaceId = () => {
  return useSelector((state) => state.workspace.current?.data?.webApp?.options?.charts?.workspaceId);
};
export const useWorkspaceChartsLogInWithUserCredentials = () => {
  return useSelector((state) => state.workspace.current?.data?.webApp?.options?.charts?.logInWithUserCredentials);
};
export const useWorkspaceChartsScenarioViewDisplayIframeRatio = () => {
  return useSelector((state) => state.workspace.current?.data?.webApp?.options?.charts?.scenarioViewIframeDisplayRatio);
};
export const useWorkspaceChartsDashboardsViewDisplayIframeRatio = () => {
  return useSelector(
    (state) => state.workspace.current?.data?.webApp?.options?.charts?.dashboardsViewIframeDisplayRatio
  );
};

export const useWorkspaceInstanceViewConfig = () => {
  return useSelector((state) => state.workspace.current?.data?.webApp?.options?.instanceView);
};

export const useUserPermissionsOnCurrentWorkspace = () => {
  const workspaceData = useWorkspaceData();
  return useMemo(
    () => workspaceData?.security?.currentUserPermissions ?? [],
    [workspaceData?.security?.currentUserPermissions]
  );
};

export const useWorkspacesList = () => {
  return useSelector((state) => state.workspace?.list);
};

export const useSelectWorkspace = () => {
  const dispatch = useDispatch();
  return useCallback((workspaceId) => dispatch(dispatchSelectWorkspace(workspaceId)), [dispatch]);
};

export const useResetCurrentWorkspace = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchResetCurrentWorkspace()), [dispatch]);
};
