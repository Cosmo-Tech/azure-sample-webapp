// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useUpdateParameters } from '../../hooks/ScenarioParametersHooks.js';
import { useUserPermissionsOnCurrentScenario } from '../../hooks/SecurityHooks.js';
import { useApplicationTheme } from '../../state/app/hooks';
import { useUserAppRoles } from '../../state/auth/hooks';
import { useCurrentSimulationRunner } from '../../state/runner/hooks';
import { useSolution } from '../../state/solutions/hooks';

export const useScenarioParameters = () => {
  const { runTemplateParametersIds } = useUpdateParameters();
  const currentScenario = useCurrentSimulationRunner();
  const solutionData = useSolution().data;
  const userRoles = useUserAppRoles();
  const userPermissionsOnCurrentScenario = useUserPermissionsOnCurrentScenario();
  const { isDarkTheme } = useApplicationTheme();

  return {
    runTemplateParametersIds,
    currentScenario,
    solutionData,
    userRoles,
    userPermissionsOnCurrentScenario,
    isDarkTheme,
  };
};
