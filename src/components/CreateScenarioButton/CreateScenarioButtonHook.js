// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import rfdc from 'rfdc';
import { useUser } from '../../state/hooks/AuthHooks';
import { useDatasets } from '../../state/hooks/DatasetHooks';
import { useCreateScenario, useCurrentScenario, useScenarios } from '../../state/hooks/ScenarioHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';
import {
  useUserPermissionsOnCurrentWorkspace,
  useWorkspaceData,
  useWorkspaceDatasetsFilter,
} from '../../state/hooks/WorkspaceHooks';
import { getCreateScenarioDialogLabels } from './labels';
import { TranslationUtils } from '../../utils';

export const useCreateScenarioButton = ({ disabled, onScenarioCreated }) => {
  const { t } = useTranslation();
  const clone = rfdc();

  const userPermissionsOnCurrentWorkspace = useUserPermissionsOnCurrentWorkspace();
  const solution = useSolution();

  const workspaceData = useWorkspaceData();
  const datasetsFilter = useWorkspaceDatasetsFilter();
  const workspaceId = workspaceData.id;

  const createScenarioOnBackend = useCreateScenario();

  const currentScenario = useCurrentScenario();

  const scenarios = useScenarios();
  const datasets = useDatasets();

  const user = useUser();

  const filteredAndTranslatedRunTemplates = useMemo(() => {
    const runTemplates = solution?.data?.runTemplates ?? [];
    const runTemplateFilter = workspaceData?.solution?.runTemplateFilter;

    if (!runTemplateFilter) {
      return runTemplates;
    }

    if (!runTemplateFilter.length) {
      return [];
    }

    const filteredRunTemplates = runTemplates.filter((rt) => runTemplateFilter.includes(rt.id));
    const translatedRunTemplates = clone(filteredRunTemplates) ?? [];
    translatedRunTemplates.forEach(
      (runTemplate) =>
        (runTemplate.name = t(TranslationUtils.getRunTemplateTranslationKey(runTemplate.id), runTemplate.name))
    );

    return translatedRunTemplates;
  }, [solution?.data?.runTemplates, workspaceData?.solution?.runTemplateFilter, t, clone]);

  const filteredDatasets = useMemo(() => {
    const getMainDatasets = () => datasets.filter((dataset) => dataset.main === true);
    if (!datasetsFilter) return getMainDatasets();

    const result = [];
    datasetsFilter.forEach((filterItem) => {
      if (typeof filterItem !== 'string')
        console.warn(`Ignoring dataset filter entry ${filterItem} because it is not a string`);
      else {
        const filteredDataset = datasets.find((dset) => dset.id === filterItem);
        if (!filteredDataset) console.warn(`No dataset found for filter entry ${filterItem}`);
        else result.push(filteredDataset);
      }
    });

    if (datasetsFilter.length > 0 && result.length === 0) {
      console.warn('Ignoring datasets filter because no matching datasets have been found');
      return getMainDatasets();
    }

    return result;
  }, [datasets, datasetsFilter]);

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
    filteredDatasets,
    scenarios,
    user,
    disabled,
    createScenarioDialogLabels,
    userPermissionsOnCurrentWorkspace,
  };
};
