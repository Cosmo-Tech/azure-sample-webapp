// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentScenario,
  useScenarioList,
  useSetScenarioValidationStatus,
  useFindScenarioById,
} from '../../state/hooks/ScenarioHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';
import { useWorkspaceId } from '../../state/hooks/WorkspaceHooks';
import { useSetApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';

export const useScenario = () => {
  const scenarioList = useScenarioList();
  const currentScenario = useCurrentScenario();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();

  const setScenarioValidationStatus = useSetScenarioValidationStatus();
  const findScenarioById = useFindScenarioById();

  const setApplicationErrorMessage = useSetApplicationErrorMessage();

  return {
    scenarioList,
    currentScenario,
    organizationId,
    workspaceId,
    setScenarioValidationStatus,
    findScenarioById,
    setApplicationErrorMessage,
  };
};
