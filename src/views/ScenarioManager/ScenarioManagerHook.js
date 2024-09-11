// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useTranslation } from 'react-i18next';
import rfdc from 'rfdc';
import { useHasUserPermissionOnScenario } from '../../hooks/SecurityHooks';
import { useUserId } from '../../state/hooks/AuthHooks';
import { useDatasets } from '../../state/hooks/DatasetHooks';
import {
  useCurrentSimulationRunnerData,
  useDeleteRunner,
  useRenameRunner,
  useResetCurrentSimulationRunner,
  useRunners,
  useUpdateRunnerData,
  useUpdateCurrentSimulationRunner,
  useRunnersListStatus,
} from '../../state/hooks/RunnerHooks';
import { useWorkspaceId } from '../../state/hooks/WorkspaceHooks';
import { TranslationUtils } from '../../utils';

export const useScenarioManager = () => {
  const { t } = useTranslation();
  const clone = rfdc();

  const scenarios = clone(useRunners());
  scenarios.forEach(
    (runner) =>
      (runner.runTemplateName = t(
        TranslationUtils.getRunTemplateTranslationKey(runner.runTemplateId),
        runner.runTemplateName
      ))
  );

  const datasets = useDatasets();
  const currentScenarioData = useCurrentSimulationRunnerData();
  const userId = useUserId();

  const hasUserPermissionOnScenario = useHasUserPermissionOnScenario();
  const setCurrentScenario = useUpdateCurrentSimulationRunner();
  const deleteScenario = useDeleteRunner();
  const renameScenario = useRenameRunner();
  const resetCurrentScenario = useResetCurrentSimulationRunner();
  const updateRunnerData = useUpdateRunnerData();
  const workspaceId = useWorkspaceId();
  const runnersListStatus = useRunnersListStatus();

  return {
    scenarios,
    datasets,
    currentScenarioData,
    userId,
    hasUserPermissionOnScenario,
    setCurrentScenario,
    deleteScenario,
    renameScenario,
    updateRunnerData,
    resetCurrentScenario,
    workspaceId,
    runnersListStatus,
  };
};
