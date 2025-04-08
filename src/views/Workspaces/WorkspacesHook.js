// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useOrganizationName } from '../../state/organizations/hooks';
import { useWorkspacesList, useSelectWorkspace, useWorkspace } from '../../state/workspaces/hooks';

export const useWorkspaces = () => {
  const workspacesList = useWorkspacesList();
  const organizationName = useOrganizationName();
  const selectWorkspace = useSelectWorkspace();
  const currentWorkspace = useWorkspace();

  return {
    workspacesList: workspacesList?.data?.toSorted((a, b) => a.name.localeCompare(b.name)),
    organizationName,
    selectWorkspace,
    currentWorkspace,
  };
};
