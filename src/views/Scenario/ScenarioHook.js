// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentScenario,
  useScenarioList,
  useApplyScenarioSharingSecurity,
  useSetScenarioValidationStatus,
  useFindScenarioById,
  useCreateScenario,
} from '../../state/hooks/ScenarioHooks';
import { useDatasetList } from '../../state/hooks/DatasetHooks';
import { useUser } from '../../state/hooks/AuthHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';
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
  const organizationId = useOrganizationId();
  const workspace = useWorkspace();
  const userPermissionsOnCurrentWorkspace = useUserPermissionsOnCurrentWorkspace();
  const solution = useSolution();
  const roles = useApplicationRoles();
  const permissions = useApplicationPermissions();
  const permissionsMapping = useApplicationPermissionsMapping();

  const applyScenarioSharingSecurity = useApplyScenarioSharingSecurity();
  const setScenarioValidationStatus = useSetScenarioValidationStatus();
  const findScenarioById = useFindScenarioById();
  const createScenario = useCreateScenario();

  const setApplicationErrorMessage = useSetApplicationErrorMessage();

  return {
    scenarioList,
    datasetList,
    currentScenario,
    user,
    organizationId,
    workspace,
    userPermissionsOnCurrentWorkspace,
    solution,
    roles,
    permissions,
    permissionsMapping,
    applyScenarioSharingSecurity,
    setScenarioValidationStatus,
    findScenarioById,
    createScenario,
    setApplicationErrorMessage,
  };
};
