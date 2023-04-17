// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentScenario,
  useScenarioList,
  useSaveScenario,
  useSaveAndLaunchScenario,
  useLaunchScenario,
} from '../../state/hooks/ScenarioHooks';
import { useDatasetList, useAddDatasetToStore } from '../../state/hooks/DatasetHooks';
import { useIsDarkTheme } from '../../state/hooks/ApplicationHooks';
import { useUserAppRoles } from '../../state/hooks/AuthHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';
import { useWorkspaceId } from '../../state/hooks/WorkspaceHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';
import { useUserPermissionsOnCurrentScenario } from '../../hooks/SecurityHooks.js';

export const useScenarioParameters = () => {
  const scenariosData = useScenarioList().data;
  const datasetsData = useDatasetList().data;
  const addDatasetToStore = useAddDatasetToStore();
  const currentScenario = useCurrentScenario();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const solutionData = useSolution().data;
  const userRoles = useUserAppRoles();
  const launchScenario = useLaunchScenario();
  const saveScenario = useSaveScenario();
  const saveAndLaunchScenario = useSaveAndLaunchScenario();
  const userPermissionsOnCurrentScenario = useUserPermissionsOnCurrentScenario();
  const isDarkTheme = useIsDarkTheme();

  return {
    scenariosData,
    datasetsData,
    addDatasetToStore,
    currentScenario,
    organizationId,
    workspaceId,
    solutionData,
    userRoles,
    launchScenario,
    saveScenario,
    saveAndLaunchScenario,
    userPermissionsOnCurrentScenario,
    isDarkTheme,
  };
};
