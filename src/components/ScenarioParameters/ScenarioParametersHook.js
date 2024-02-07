// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useUpdateParameters } from '../../hooks/ScenarioParametersHooks.js';
import { useUserPermissionsOnCurrentScenario } from '../../hooks/SecurityHooks.js';
import { useIsDarkTheme } from '../../state/hooks/ApplicationHooks';
import { useUserAppRoles } from '../../state/hooks/AuthHooks';
import { useDatasets } from '../../state/hooks/DatasetHooks';
import { useCurrentScenario } from '../../state/hooks/ScenarioHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';

export const useScenarioParameters = () => {
  const { runTemplateParametersIds, parametersMetadata } = useUpdateParameters();
  const datasets = useDatasets();
  const currentScenario = useCurrentScenario();
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
