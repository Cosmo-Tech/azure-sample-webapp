// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentScenario,
  useScenarioList,
  useApplyScenarioSharingSecurity,
  useSetScenarioValidationStatus,
  useFindScenarioById,
  useCreateScenario,
  useUpdateAndLaunchScenario,
  useLaunchScenario,
} from '../../state/hooks/ScenarioHooks';
import { useDatasetList, useAddDatasetToStore } from '../../state/hooks/DatasetHooks';
import { useUser } from '../../state/hooks/AuthHooks';
import { useWorkspace, useUserPermissionsOnCurrentWorkspace } from '../../state/hooks/WorkspaceHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';
import {
  useSetApplicationErrorMessage,
  useApplicationRoles,
  useApplicationPermissions,
  useApplicationPermissionsMapping,
} from '../../state/hooks/ApplicationHooks';

export const useScenario = () => {
  const scenarioList = useScenarioList();
  const datasetList = useDatasetList();
  const currentScenario = useCurrentScenario();
  const user = useUser();
  const workspace = useWorkspace();
  const userPermissionsOnCurrentWorkspace = useUserPermissionsOnCurrentWorkspace();
  const solution = useSolution();
  const roles = useApplicationRoles();
  const permissions = useApplicationPermissions();
  const permissionsMapping = useApplicationPermissionsMapping();

  const addDatasetToStore = useAddDatasetToStore();

  const applyScenarioSharingSecurity = useApplyScenarioSharingSecurity();
  const setScenarioValidationStatus = useSetScenarioValidationStatus();
  const findScenarioById = useFindScenarioById();
  const createScenario = useCreateScenario();

  const updateAndLaunchScenario = useUpdateAndLaunchScenario();

  const launchScenario = useLaunchScenario();

  const setApplicationErrorMessage = useSetApplicationErrorMessage();

  return [
    scenarioList,
    datasetList,
    currentScenario,
    user,
    workspace,
    userPermissionsOnCurrentWorkspace,
    solution,
    roles,
    permissions,
    permissionsMapping,
    addDatasetToStore,
    applyScenarioSharingSecurity,
    setScenarioValidationStatus,
    findScenarioById,
    createScenario,
    updateAndLaunchScenario,
    launchScenario,
    setApplicationErrorMessage,
  ];
};
