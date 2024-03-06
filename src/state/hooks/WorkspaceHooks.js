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

export const useWorkspaceDatasetsFilter = () => {
  const workspaceData = useWorkspaceData();

  return useMemo(() => {
    let filter = workspaceData?.linkedDatasetIdList;
    if (filter != null && !Array.isArray(filter)) {
      console.warn('Ignoring datasets filter "linkedDatasetIdList" because it is not an array');
      filter = undefined;
    }

    let deprecatedFilter = workspaceData?.webApp?.options?.datasetFilter;
    if (deprecatedFilter != null) {
      console.warn(
        `Deprecated option used in configuration of workspace ${workspaceData?.id}` +
          (workspaceData?.name ? ` (${workspaceData?.name})` : '') +
          '.\nWorkspace key "webApp.options.datasetFilter" is deprecated. Please use the Cosmo Tech API to link ' +
          'these datasets to your workspace instead.'
      );
      if (!Array.isArray(deprecatedFilter)) {
        console.warn('Ignoring deprecated option "datasetFilter" because it is not an array');
        deprecatedFilter = undefined;
      }
    }

    if (filter == null && deprecatedFilter == null) return undefined;
    return (filter ?? []).concat(deprecatedFilter ?? []);
  }, [
    workspaceData?.id,
    workspaceData?.name,
    workspaceData?.linkedDatasetIdList,
    workspaceData?.webApp?.options?.datasetFilter,
  ]);
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

export const useWorkspacesReducerStatus = () => {
  return useSelector((state) => state.workspace?.list?.status);
};

export const useSelectWorkspace = () => {
  const dispatch = useDispatch();
  return useCallback((workspaceId) => dispatch(dispatchSelectWorkspace(workspaceId)), [dispatch]);
};

export const useResetCurrentWorkspace = () => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(dispatchResetCurrentWorkspace()), [dispatch]);
};
