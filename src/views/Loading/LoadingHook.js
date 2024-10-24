// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useDatasetsReducerStatus } from '../../state/datasets/hooks';
import { useOrganization } from '../../state/organizations/hooks';
import { usePowerBIReducerStatus } from '../../state/powerBi/hooks';
import { useRunnersReducerStatus } from '../../state/runner/hooks';
import { useSolution } from '../../state/solutions/hooks';
import { useWorkspacesReducerStatus, useWorkspace, useWorkspaceData } from '../../state/workspaces/hooks';

export const useLoading = () => {
  const powerBIReducerStatus = usePowerBIReducerStatus();
  const runnersReducerStatus = useRunnersReducerStatus();
  const workspaces = useWorkspaceData();
  const workspacesReducerStatus = useWorkspacesReducerStatus();
  const currentWorkspaceReducerStatus = useWorkspace()?.status;
  const solutionReducerStatus = useSolution()?.status;
  const organizationReducerStatus = useOrganization()?.status;
  const datasetsReducerStatus = useDatasetsReducerStatus();

  return {
    powerBIReducerStatus,
    runnersReducerStatus,
    workspaces,
    workspacesReducerStatus,
    currentWorkspaceReducerStatus,
    solutionReducerStatus,
    datasetsReducerStatus,
    organizationReducerStatus,
  };
};
