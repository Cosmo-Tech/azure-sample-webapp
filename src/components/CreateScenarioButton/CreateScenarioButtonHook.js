// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import rfdc from 'rfdc';
import { useWorkspaceDatasets } from '../../hooks/WorkspaceDatasetsHooks';
import { useUser } from '../../state/auth/hooks';
import { useCreateSimulationRunner, useCurrentSimulationRunner, useRunners } from '../../state/runner/hooks';
import { useScenarioRunTemplates, useSolution } from '../../state/solutions/hooks';
import {
  useDefaultRunTemplateDataset,
  useUserPermissionsOnCurrentWorkspace,
  useWorkspaceData,
} from '../../state/workspaces/hooks';
import { DatasetsUtils, TranslationUtils } from '../../utils';
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
  const usableDatasets = workspaceDatasets.filter(DatasetsUtils.isVisibleInScenarioCreation);

  const createScenarioOnBackend = useCreateSimulationRunner();

  const currentScenario = useCurrentSimulationRunner();

  const scenarios = useRunners();

  const user = useUser();

  const filteredAndTranslatedRunTemplates = useMemo(() => {
    const runTemplateFilter = workspaceData?.additionalData?.webapp?.solution?.runTemplateFilter;

    const translateTemplates = (templates) => {
      const cloned = clone(templates) ?? [];
      cloned.forEach(
        (runTemplate) =>
          (runTemplate.name = t(TranslationUtils.getRunTemplateTranslationKey(runTemplate.id), runTemplate.name))
      );
      return cloned;
    };

    if (!runTemplateFilter) return translateTemplates(runTemplates);

    if (!runTemplateFilter.length) return [];

    const filtered = runTemplates.filter((rt) => runTemplateFilter.includes(rt.id));
    return translateTemplates(filtered);
  }, [runTemplates, workspaceData?.additionalData?.webapp?.solution?.runTemplateFilter, t, clone]);

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
