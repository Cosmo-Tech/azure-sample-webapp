// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useWorkspaceData, useWorkspacesList } from '../../../../state/hooks/WorkspaceHooks';
import { useResetCurrentSolution } from '../../../../state/hooks/SolutionHooks';

export const useWorkspaceInfo = () => {
  const currentWorkspaceData = useWorkspaceData();
  const workspacesList = useWorkspacesList();
  const resetCurrentSolution = useResetCurrentSolution();
  return { currentWorkspaceData, workspacesList, resetCurrentSolution };
};
