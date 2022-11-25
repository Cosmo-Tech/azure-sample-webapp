// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useWorkspacesList, useSelectWorkspace } from '../../state/hooks/WorkspaceHooks';
import { useOrganizationName } from '../../state/hooks/OrganizationHooks';

export const useWorkspaces = () => {
  const workspacesList = useWorkspacesList();
  const organizationName = useOrganizationName();
  const selectWorkspace = useSelectWorkspace();

  return {
    workspacesList,
    organizationName,
    selectWorkspace,
  };
};
