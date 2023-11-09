// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../state/hooks/AuthHooks';
import { useDatasets } from '../../state/hooks/DatasetHooks';
import { useCreateScenario, useCurrentScenario, useScenarios } from '../../state/hooks/ScenarioHooks';
import { useSolution } from '../../state/hooks/SolutionHooks';
import { useUserPermissionsOnCurrentWorkspace, useWorkspaceData } from '../../state/hooks/WorkspaceHooks';
import { getCreateScenarioDialogLabels, logsLabels } from './labels';

export const useCreateScenarioButton = ({ disabled, onScenarioCreated }) => {
  const { t } = useTranslation();

  const userPermissionsOnCurrentWorkspace = useUserPermissionsOnCurrentWorkspace();
  const solution = useSolution();

  const workspaceData = useWorkspaceData();
  const workspaceId = workspaceData.id;

  const createScenarioOnBackend = useCreateScenario();

  const currentScenario = useCurrentScenario();

  const scenarios = useScenarios();
  const datasets = useDatasets();

  const user = useUser();

  const filteredRunTemplates = useMemo(() => {
    const runTemplates = solution?.data?.runTemplates ?? [];
    const runTemplateFilter = workspaceData?.solution?.runTemplateFilter;

    if (!runTemplateFilter) {
      return runTemplates;
    }

    if (!runTemplateFilter.length) {
      return [];
    }

    return runTemplates.filter((rt) => runTemplateFilter.includes(rt.id));
  }, [solution?.data?.runTemplates, workspaceData?.solution?.runTemplateFilter]);

  const filteredDatasetList = useMemo(() => {
    const datasetFilter = workspaceData?.webApp?.options?.datasetFilter;
    if (!datasetFilter) {
      return datasets;
    }

    if (!Array.isArray(datasetFilter) || !datasetFilter.length) {
      console.warn(logsLabels.warning.datasetFilter.emptyOrNotArray);
      return datasets;
    }

    const result = [];
    datasetFilter.forEach((dsetFilter) => {
      if (typeof dsetFilter !== 'string') {
        console.warn(logsLabels.warning.datasetFilter.getNotAString(dsetFilter));
      } else {
        const filteredDataset = datasets.find((dset) => dset.id === dsetFilter);
        if (!filteredDataset) {
          console.warn(logsLabels.warning.datasetFilter.getDatasetNotFoundForFilter(dsetFilter));
        } else {
          result.push(filteredDataset);
        }
      }
    });

    if (!result.length) {
      console.warn(logsLabels.warning.datasetFilter.noDatasetFound);
      return datasets;
    }

    return result;
  }, [datasets, workspaceData?.webApp?.options?.datasetFilter]);

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
    filteredRunTemplates,
    filteredDatasetList,
    scenarios,
    user,
    disabled,
    createScenarioDialogLabels,
    userPermissionsOnCurrentWorkspace,
  };
};
