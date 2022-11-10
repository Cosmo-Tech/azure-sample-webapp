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

export const useUserPermissionsOnCurrentWorkspace = () => {
  const workspaceData = useWorkspaceData();
  return useMemo(
    () => workspaceData?.security?.currentUserPermissions || [],
    [workspaceData?.security?.currentUserPermissions]
  );
};
