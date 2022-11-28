// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { usePowerBIInfo } from '../../state/hooks/PowerBIHooks';
import { useScenarioList } from '../../state/hooks/ScenarioHooks';
import { useWorkspacesList, useWorkspace } from '../../state/hooks/WorkspaceHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';
import { useOrganization } from '../../state/hooks/OrganizationHooks';
import { useDatasetList } from '../../state/hooks/DatasetHooks';

export const useLoading = () => {
  const powerBIInfo = usePowerBIInfo();
  const scenarioList = useScenarioList();
  const workspaces = useWorkspacesList();
  const currentWorkspace = useWorkspace();
  const solution = useSolution();
  const organization = useOrganization();
  const datasetList = useDatasetList();

  return { powerBIInfo, scenarioList, workspaces, currentWorkspace, solution, datasetList, organization };
};
