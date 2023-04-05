// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentScenario,
  useCurrentScenarioLastRunId,
  useScenarioList,
  useSetScenarioValidationStatus,
  useFindScenarioById,
} from '../../state/hooks/ScenarioHooks';
import { useCurrentScenarioRun, useFetchScenarioRunById } from '../../state/hooks/ScenarioRunHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';
import { useWorkspaceId } from '../../state/hooks/WorkspaceHooks';
import { useSetApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';

export const useScenario = () => {
  const scenarioList = useScenarioList();
  const currentScenario = useCurrentScenario();
  const currentScenarioRunId = useCurrentScenarioLastRunId();
  const currentScenarioRun = useCurrentScenarioRun();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();

  const setScenarioValidationStatus = useSetScenarioValidationStatus();
  const findScenarioById = useFindScenarioById();
  const fetchScenarioRunById = useFetchScenarioRunById();

  const setApplicationErrorMessage = useSetApplicationErrorMessage();

  return {
    scenarioList,
    currentScenario,
    currentScenarioRun,
    currentScenarioRunId,
    organizationId,
    workspaceId,
    setScenarioValidationStatus,
    findScenarioById,
    setApplicationErrorMessage,
    fetchScenarioRunById,
  };
};
