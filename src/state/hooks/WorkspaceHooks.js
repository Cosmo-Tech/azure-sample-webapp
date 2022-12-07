// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

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
  return useSelector((state) => state.workspace.current?.data?.webapp?.options?.charts);
};
export const useWorkspaceChartsWorkspaceId = () => {
  return useSelector((state) => state.workspace.current?.data?.webapp?.options?.charts?.workspaceId);
};
export const useWorkspaceChartsLogInWithUserCredentials = () => {
  return useSelector((state) => state.workspace.current?.data?.webapp?.options?.charts?.logInWithUserCredentials);
};
export const useWorkspaceChartsScenarioViewDisplayIframeRatio = () => {
  return useSelector((state) => state.workspace.current?.data?.webapp?.options?.charts?.scenarioViewIframeDisplayRatio);
};
export const useWorkspaceChartsDashboardsViewDisplayIframeRatio = () => {
  return useSelector(
    (state) => state.workspace.current?.data?.webapp?.options?.charts?.dashboardsViewIframeDisplayRatio
  );
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
