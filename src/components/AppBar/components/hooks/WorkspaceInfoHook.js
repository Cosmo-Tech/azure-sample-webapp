// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useWorkspaceData, useWorkspacesList } from '../../../../state/workspaces/hooks';

export const useWorkspaceInfo = () => {
  const currentWorkspaceData = useWorkspaceData();
  const workspacesList = useWorkspacesList();
  return { currentWorkspaceData, workspacesList };
};
