// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentScenarioData,
  useScenarioList,
  useFindScenarioById,
  useUpdateCurrentScenario,
  useDeleteScenario,
  useRenameScenario,
  useResetCurrentScenario,
} from '../../state/hooks/ScenarioHooks';
import { useDatasetList } from '../../state/hooks/DatasetHooks';
import { useUserId } from '../../state/hooks/AuthHooks';
import { useHasUserPermissionOnScenario } from '../../hooks/SecurityHooks';

export const useScenarioManager = () => {
  const scenarios = useScenarioList().data;
  const datasets = useDatasetList().data;
  const currentScenarioData = useCurrentScenarioData();
  const userId = useUserId();

  const findScenarioById = useFindScenarioById();
  const hasUserPermissionOnScenario = useHasUserPermissionOnScenario();
  const setCurrentScenario = useUpdateCurrentScenario();
  const deleteScenario = useDeleteScenario();
  const renameScenario = useRenameScenario();
  const resetCurrentScenario = useResetCurrentScenario();

  return {
    scenarios,
    datasets,
    currentScenarioData,
    userId,
    findScenarioById,
    hasUserPermissionOnScenario,
    setCurrentScenario,
    deleteScenario,
    renameScenario,
    resetCurrentScenario,
  };
};
