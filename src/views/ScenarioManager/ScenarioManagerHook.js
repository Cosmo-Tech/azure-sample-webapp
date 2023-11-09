// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentScenarioData,
  useScenarios,
  useUpdateCurrentScenario,
  useDeleteScenario,
  useRenameScenario,
  useResetCurrentScenario,
} from '../../state/hooks/ScenarioHooks';
import { useDatasets } from '../../state/hooks/DatasetHooks';
import { useUserId } from '../../state/hooks/AuthHooks';
import { useHasUserPermissionOnScenario } from '../../hooks/SecurityHooks';
import { useWorkspaceId } from '../../state/hooks/WorkspaceHooks';

export const useScenarioManager = () => {
  const scenarios = useScenarios();
  const datasets = useDatasets();
  const currentScenarioData = useCurrentScenarioData();
  const userId = useUserId();

  const hasUserPermissionOnScenario = useHasUserPermissionOnScenario();
  const setCurrentScenario = useUpdateCurrentScenario();
  const deleteScenario = useDeleteScenario();
  const renameScenario = useRenameScenario();
  const resetCurrentScenario = useResetCurrentScenario();
  const workspaceId = useWorkspaceId();

  return {
    scenarios,
    datasets,
    currentScenarioData,
    userId,
    hasUserPermissionOnScenario,
    setCurrentScenario,
    deleteScenario,
    renameScenario,
    resetCurrentScenario,
    workspaceId,
  };
};
