// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useTranslation } from 'react-i18next';
import rfdc from 'rfdc';
import { useHasUserPermissionOnScenario } from '../../hooks/SecurityHooks';
import { useUserId } from '../../state/hooks/AuthHooks';
import { useDatasets } from '../../state/hooks/DatasetHooks';
import {
  useCurrentScenarioData,
  useScenarios,
  useUpdateCurrentScenario,
  useDeleteScenario,
  useRenameScenario,
  useResetCurrentScenario,
} from '../../state/hooks/ScenarioHooks';
import { useWorkspaceId } from '../../state/hooks/WorkspaceHooks';
import { TranslationUtils } from '../../utils';

export const useScenarioManager = () => {
  const { t } = useTranslation();
  const clone = rfdc();

  const scenarios = clone(useScenarios());
  scenarios.forEach(
    (scenario) =>
      (scenario.runTemplateName = t(
        TranslationUtils.getRunTemplateTranslationKey(scenario.runTemplateId),
        scenario.runTemplateName
      ))
  );

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
