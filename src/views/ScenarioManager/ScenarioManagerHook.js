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
  const scenarioList = useScenarioList();
  const datasetList = useDatasetList();
  const currentScenarioData = useCurrentScenarioData();
  const userId = useUserId();

  const findScenarioById = useFindScenarioById();
  const hasUserPermissionOnScenario = useHasUserPermissionOnScenario();
  const updateCurrentScenario = useUpdateCurrentScenario();
  const deleteScenario = useDeleteScenario();
  const renameScenario = useRenameScenario();
  const resetCurrentScenario = useResetCurrentScenario();

  return [
    scenarioList.data,
    datasetList.data,
    currentScenarioData,
    userId,
    findScenarioById,
    hasUserPermissionOnScenario,
    updateCurrentScenario,
    deleteScenario,
    renameScenario,
    resetCurrentScenario,
  ];
};
