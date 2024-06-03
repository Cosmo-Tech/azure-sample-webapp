// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';
import { useDatasets } from '../../state/hooks/DatasetHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';
import { useCurrentSimulationRunnerData, useSetSimulationRunnerValidationStatus } from '../../state/hooks/RunnerHooks';
import { useWorkspaceId } from '../../state/hooks/WorkspaceHooks';

export const useScenario = () => {
  const { t } = useTranslation();
  const currentScenarioData = useCurrentSimulationRunnerData();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const datasets = useDatasets();
  const currentScenarioDatasetName = useMemo(() => {
    if (!currentScenarioData?.datasetList || currentScenarioData?.datasetList?.length === 0)
      return t('views.scenario.text.nodataset', 'None');
    return (
      datasets?.find((dataset) => dataset.id === currentScenarioData?.datasetList?.[0])?.name ??
      t('views.scenario.text.datasetNotFound', 'Not found')
    );
  }, [currentScenarioData?.datasetList, datasets, t]);
  const setScenarioValidationStatus = useSetSimulationRunnerValidationStatus();
  const setApplicationErrorMessage = useSetApplicationErrorMessage();

  return {
    currentScenarioData,
    organizationId,
    workspaceId,
    setScenarioValidationStatus,
    setApplicationErrorMessage,
    currentScenarioDatasetName,
  };
};
