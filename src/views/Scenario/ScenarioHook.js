// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetApplicationErrorMessage } from '../../state/app/hooks';
import { useDatasets } from '../../state/datasets/hooks';
import { useOrganizationId } from '../../state/organizations/hooks';
import {
  useCurrentSimulationRunnerData,
  useSetSimulationRunnerValidationStatus,
  useCurrentSimulationRunnerBaseDatasetIds,
} from '../../state/runner/hooks';
import { useWorkspaceId } from '../../state/workspaces/hooks';

export const useScenario = () => {
  const { t } = useTranslation();
  const setApplicationErrorMessage = useSetApplicationErrorMessage();
  const setScenarioValidationStatus = useSetSimulationRunnerValidationStatus();

  const currentScenarioData = useCurrentSimulationRunnerData();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const datasets = useDatasets();
  const currentSimulationRunnerBaseDatasetIds = useCurrentSimulationRunnerBaseDatasetIds();

  const { baseDatasets, missingDatasetIds } = useMemo(() => {
    const baseDatasets = datasets.filter((dataset) => currentSimulationRunnerBaseDatasetIds?.includes(dataset.id));

    let missingDatasetIds = [];
    if (currentSimulationRunnerBaseDatasetIds) {
      missingDatasetIds = currentSimulationRunnerBaseDatasetIds.filter(
        (datasetId) => !baseDatasets.some((dataset) => dataset.id === datasetId)
      );
    }
    return { baseDatasets, missingDatasetIds };
  }, [datasets, currentSimulationRunnerBaseDatasetIds]);

  const currentScenarioDatasetName = useMemo(() => {
    if (baseDatasets.length === 0) return t('views.scenario.text.nodataset', 'None');
    return baseDatasets[0].name ?? t('views.scenario.text.datasetNotFound', 'Not found');
  }, [baseDatasets, t]);

  useEffect(() => {
    if (missingDatasetIds.length > 0) {
      const errorTitle = t('commoncomponents.banner.missingDataset', 'Dataset not found');
      const errorMessage = t(
        'commoncomponents.banner.cannotAccessBaseDatasets',
        'Some parts of the scenario "{{scenarioName}}" ({{scenarioId}}) could not be loaded, because the associated ' +
          'dataset "{{baseDatasetId}}" does not exist, or you don\'t have access to it.',
        {
          baseDatasetId: missingDatasetIds[0],
          scenarioId: currentScenarioData.id,
          scenarioName: currentScenarioData.name,
        }
      );
      setApplicationErrorMessage({ title: errorTitle }, errorMessage);
    }
  }, [t, setApplicationErrorMessage, currentScenarioData?.id, currentScenarioData?.name, missingDatasetIds]);
  return {
    currentScenarioData,
    organizationId,
    workspaceId,
    setScenarioValidationStatus,
    setApplicationErrorMessage,
    currentScenarioDatasetName,
    baseDatasets,
    missingDatasetIds,
  };
};
