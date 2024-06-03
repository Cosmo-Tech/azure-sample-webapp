// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useSetApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';
import { useCurrentSimulationRunnerData, useSetSimulationRunnerValidationStatus } from '../../state/hooks/RunnerHooks';
import { useWorkspaceId } from '../../state/hooks/WorkspaceHooks';

export const useScenario = () => {
  const currentScenarioData = useCurrentSimulationRunnerData();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();

  const setScenarioValidationStatus = useSetSimulationRunnerValidationStatus();

  const setApplicationErrorMessage = useSetApplicationErrorMessage();

  return {
    currentScenarioData,
    organizationId,
    workspaceId,
    setScenarioValidationStatus,
    setApplicationErrorMessage,
  };
};
