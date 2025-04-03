// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import rfdc from 'rfdc';
import { useWorkspaceDatasets } from '../../hooks/WorkspaceDatasetsHooks';
import { INGESTION_STATUS, TWINCACHE_STATUS } from '../../services/config/ApiConstants';
import { useUser } from '../../state/auth/hooks';
import { useCreateSimulationRunner, useCurrentSimulationRunner, useRunners } from '../../state/runner/hooks';
import { useScenarioRunTemplates, useSolution } from '../../state/solutions/hooks';
import {
  useDefaultRunTemplateDataset,
  useUserPermissionsOnCurrentWorkspace,
  useWorkspaceData,
} from '../../state/workspaces/hooks';
import { TranslationUtils } from '../../utils';
import { getCreateScenarioDialogLabels } from './labels';

export const useCreateScenarioButton = ({ disabled, onScenarioCreated }) => {
  const { t } = useTranslation();
  const clone = rfdc();

  const userPermissionsOnCurrentWorkspace = useUserPermissionsOnCurrentWorkspace();
  const runTemplates = useScenarioRunTemplates();
  const defaultRunTemplateDataset = useDefaultRunTemplateDataset();
  const solution = useSolution();

  const workspaceData = useWorkspaceData();
  const workspaceId = workspaceData.id;
  const workspaceDatasets = useWorkspaceDatasets();
  const usableDatasets = workspaceDatasets.filter(
    (dataset) =>
      !dataset.main ||
      (dataset.ingestionStatus === INGESTION_STATUS.SUCCESS && dataset.twincacheStatus === TWINCACHE_STATUS.FULL)
  );

  const createScenarioOnBackend = useCreateSimulationRunner();

  const currentScenario = useCurrentSimulationRunner();

  const scenarios = useRunners();

  const user = useUser();

  const filteredAndTranslatedRunTemplates = useMemo(() => {
    const runTemplateFilter = workspaceData?.solution?.runTemplateFilter;
    if (!runTemplateFilter) return runTemplates;
    if (!runTemplateFilter.length) return [];

    const filteredRunTemplates = runTemplates.filter((rt) => runTemplateFilter.includes(rt.id));
    const translatedRunTemplates = clone(filteredRunTemplates) ?? [];
    translatedRunTemplates.forEach(
      (runTemplate) =>
        (runTemplate.name = t(TranslationUtils.getRunTemplateTranslationKey(runTemplate.id), runTemplate.name))
    );

    return translatedRunTemplates;
  }, [runTemplates, workspaceData?.solution?.runTemplateFilter, t, clone]);

  const createScenarioDialogLabels = getCreateScenarioDialogLabels(t, disabled);

  const createScenario = useCallback(
    (workspaceId, scenarioData) => {
      createScenarioOnBackend(scenarioData);
      onScenarioCreated && onScenarioCreated();
    },
    [createScenarioOnBackend, onScenarioCreated]
  );

  return {
    solution,
    workspaceId,
    createScenario,
    currentScenario,
    filteredAndTranslatedRunTemplates,
    filteredDatasets: usableDatasets,
    scenarios,
    user,
    disabled,
    createScenarioDialogLabels,
    userPermissionsOnCurrentWorkspace,
    defaultRunTemplateDataset,
  };
};
