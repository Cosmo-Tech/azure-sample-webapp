// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useUpdateParameters } from '../../hooks/ScenarioParametersHooks.js';
import { useUserPermissionsOnCurrentScenario } from '../../hooks/SecurityHooks.js';
import { useIsDarkTheme } from '../../state/hooks/ApplicationHooks';
import { useUserAppRoles } from '../../state/hooks/AuthHooks';
import { useDatasets } from '../../state/hooks/DatasetHooks';
import { useCurrentSimulationRunner } from '../../state/hooks/RunnerHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';

export const useScenarioParameters = () => {
  const { runTemplateParametersIds, parametersMetadata } = useUpdateParameters();
  const datasets = useDatasets();
  const currentScenario = useCurrentSimulationRunner();
  const solutionData = useSolution().data;
  const userRoles = useUserAppRoles();
  const userPermissionsOnCurrentScenario = useUserPermissionsOnCurrentScenario();
  const isDarkTheme = useIsDarkTheme();

  return {
    runTemplateParametersIds,
    parametersMetadata,
    datasets,
    currentScenario,
    solutionData,
    userRoles,
    userPermissionsOnCurrentScenario,
    isDarkTheme,
  };
};
