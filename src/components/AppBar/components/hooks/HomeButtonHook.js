// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useWorkspace, useWorkspacesList } from '../../../../state/hooks/WorkspaceHooks';

export const useHomeButton = () => {
  const currentWorkspace = useWorkspace();
  const workspacesList = useWorkspacesList();
  return { currentWorkspace, workspacesList };
};
