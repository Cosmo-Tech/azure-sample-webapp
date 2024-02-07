// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useSetApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';
import {
  useCurrentScenarioLastRunId,
  useSetScenarioValidationStatus,
  useFindScenarioById,
  useCurrentScenarioData,
} from '../../state/hooks/ScenarioHooks';
import { useCurrentScenarioRun, useFetchScenarioRunById } from '../../state/hooks/ScenarioRunHooks';
import { useWorkspaceId } from '../../state/hooks/WorkspaceHooks';

export const useScenario = () => {
  const currentScenarioRunId = useCurrentScenarioLastRunId();
  const currentScenarioRun = useCurrentScenarioRun();
  const currentScenarioData = useCurrentScenarioData();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();

  const setScenarioValidationStatus = useSetScenarioValidationStatus();
  const findScenarioById = useFindScenarioById();
  const fetchScenarioRunById = useFetchScenarioRunById();

  const setApplicationErrorMessage = useSetApplicationErrorMessage();

  return {
    currentScenarioRun,
    currentScenarioRunId,
    currentScenarioData,
    organizationId,
    workspaceId,
    setScenarioValidationStatus,
    findScenarioById,
    setApplicationErrorMessage,
    fetchScenarioRunById,
  };
};
