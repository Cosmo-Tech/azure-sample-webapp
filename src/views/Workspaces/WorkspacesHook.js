// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useWorkspacesList, useSelectWorkspace, useWorkspace } from '../../state/hooks/WorkspaceHooks';
import { useOrganizationName } from '../../state/hooks/OrganizationHooks';

export const useWorkspaces = () => {
  const workspacesList = useWorkspacesList();
  const organizationName = useOrganizationName();
  const selectWorkspace = useSelectWorkspace();
  const currentWorkspace = useWorkspace();

  return {
    workspacesList,
    organizationName,
    selectWorkspace,
    currentWorkspace,
  };
};
