// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCurrentScenario } from '../../state/hooks/ScenarioHooks';
import { useDatasetList } from '../../state/hooks/DatasetHooks';
import { useIsDarkTheme } from '../../state/hooks/ApplicationHooks';
import { useUserAppRoles } from '../../state/hooks/AuthHooks';
import { useSolutionData } from '../../state/hooks/SolutionHooks';
import { useUserPermissionsOnCurrentScenario } from '../../hooks/SecurityHooks.js';

export const useScenarioParameters = () => {
  const datasetsData = useDatasetList().data;
  const currentScenario = useCurrentScenario();
  const solutionData = useSolutionData();
  const userRoles = useUserAppRoles();
  const userPermissionsOnCurrentScenario = useUserPermissionsOnCurrentScenario();
  const isDarkTheme = useIsDarkTheme();

  return {
    datasetsData,
    currentScenario,
    solutionData,
    userRoles,
    userPermissionsOnCurrentScenario,
    isDarkTheme,
  };
};
