// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useDatasetsReducerStatus } from '../../state/hooks/DatasetHooks';
import { useOrganization } from '../../state/hooks/OrganizationHooks';
import { usePowerBIReducerStatus } from '../../state/hooks/PowerBIHooks';
import { useScenariosReducerStatus } from '../../state/hooks/ScenarioHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';
import { useWorkspacesReducerStatus, useWorkspace, useWorkspaceData } from '../../state/hooks/WorkspaceHooks';

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
