// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dispatchSelectWorkspace } from './dispatchers';
import { resetCurrentWorkspace } from './reducers';

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
  return useSelector((state) => state.workspace.current?.data?.additionalData?.webapp?.charts);
};
export const useWorkspaceChartsWorkspaceId = () => {
  return useSelector((state) => state.workspace.current?.data?.additionalData?.webapp?.charts?.workspaceId);
};
export const useWorkspaceChartsLogInWithUserCredentials = () => {
  return useSelector(
    (state) => state.workspace.current?.data?.additionalData?.webapp?.charts?.logInWithUserCredentials
  );
};
export const useWorkspaceChartsScenarioViewDisplayIframeRatio = () => {
  return useSelector(
    (state) => state.workspace.current?.data?.additionalData?.webapp?.charts?.scenarioViewIframeDisplayRatio
  );
};
export const useWorkspaceChartsDashboardsViewDisplayIframeRatio = () => {
  return useSelector(
    (state) => state.workspace.current?.data?.additionalData?.webapp?.charts?.dashboardsViewIframeDisplayRatio
  );
};

export const useWorkspaceInstanceViewConfig = () => {
  return useSelector((state) => state.workspace.current?.data?.additionalData?.webapp?.instanceView);
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

export const useWorkspacesReducerStatus = () => {
  return useSelector((state) => state.workspace?.list?.status);
};

export const useDefaultRunTemplateDataset = () => {
  return useSelector(
    (state) => state.workspace?.current?.data?.additionalData?.webapp?.solution?.defaultRunTemplateDataset
  );
};

export const useSelectWorkspace = () => {
  const dispatch = useDispatch();
  return useCallback((workspaceId) => dispatch(dispatchSelectWorkspace(workspaceId)), [dispatch]);
};

export const useResetCurrentWorkspace = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(resetCurrentWorkspace()), [dispatch]);
};
