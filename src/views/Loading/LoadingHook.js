// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { usePowerBIInfo } from '../../state/hooks/PowerBIHooks';
import { useScenarioList, useCurrentScenario } from '../../state/hooks/ScenarioHooks';
import { useWorkspace } from '../../state/hooks/WorkspaceHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';
import { useDatasetList } from '../../state/hooks/DatasetHooks';
import { useApplication } from '../../state/hooks/ApplicationHooks';

export const useLoading = () => {
  const powerBIInfo = usePowerBIInfo();
  const scenarioList = useScenarioList();
  const currentScenario = useCurrentScenario();
  const workspace = useWorkspace();
  const solution = useSolution();
  const datasetList = useDatasetList();
  const application = useApplication();

  return [powerBIInfo, scenarioList, currentScenario, workspace, solution, datasetList, application];
};
