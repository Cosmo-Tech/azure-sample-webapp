// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useWorkspace, useWorkspacesList } from '../../../../state/hooks/WorkspaceHooks';
import { useResetCurrentSolution } from '../../../../state/hooks/SolutionHooks';

export const useHomeButton = () => {
  const currentWorkspace = useWorkspace();
  const workspacesList = useWorkspacesList();
  const resetCurrentSolution = useResetCurrentSolution();
  return { currentWorkspace, workspacesList, resetCurrentSolution };
};
