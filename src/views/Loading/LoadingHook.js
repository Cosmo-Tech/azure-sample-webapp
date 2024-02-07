// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { usePowerBIReducerStatus } from '../../state/hooks/PowerBIHooks';
import { useScenariosReducerStatus } from '../../state/hooks/ScenarioHooks';
import { useWorkspacesReducerStatus, useWorkspace, useWorkspaceData } from '../../state/hooks/WorkspaceHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';
import { useOrganization } from '../../state/hooks/OrganizationHooks';
import { useDatasetsReducerStatus } from '../../state/hooks/DatasetHooks';

export const useLoading = () => {
  const powerBIReducerStatus = usePowerBIReducerStatus();
  const scenariosReducerStatus = useScenariosReducerStatus();
  const workspaces = useWorkspaceData();
  const workspacesReducerStatus = useWorkspacesReducerStatus();
  const currentWorkspaceReducerStatus = useWorkspace()?.status;
  const solutionReducerStatus = useSolution()?.status;
  const organizationReducerStatus = useOrganization()?.status;
  const datasetsReducerStatus = useDatasetsReducerStatus();

  return {
    powerBIReducerStatus,
    scenariosReducerStatus,
    workspaces,
    workspacesReducerStatus,
    currentWorkspaceReducerStatus,
    solutionReducerStatus,
    datasetsReducerStatus,
    organizationReducerStatus,
  };
};
