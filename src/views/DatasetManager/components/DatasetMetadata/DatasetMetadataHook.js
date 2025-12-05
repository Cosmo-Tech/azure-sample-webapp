// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCurrentDataset,
  useDatasets,
  useUpdateDataset,
  useSelectedDatasetIndex,
} from '../../../../state/datasets/hooks';
import { useOrganizationId } from '../../../../state/organizations/hooks';
import { useGetETLRunners } from '../../../../state/runner/hooks';
import { useWorkspaceId } from '../../../../state/workspaces/hooks';
import { DatasetsUtils, TranslationUtils } from '../../../../utils';

export const useDatasetMetadata = () => {
  const { t } = useTranslation();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const currentDataset = useCurrentDataset();
  const selectedDatasetIndex = useSelectedDatasetIndex();
  const runners = useGetETLRunners();

  const etlDatasetRunTemplateName = useMemo(() => {
    if (DatasetsUtils.getDatasetOption(currentDataset, 'sourceType') === 'ETL') {
      const datasetRunnerId = DatasetsUtils.getDatasetOption(currentDataset, 'runnerId');
      const datasetRunner = runners.find((runner) => runner.id === datasetRunnerId) ?? null;
      return datasetRunner
        ? t(TranslationUtils.getRunTemplateTranslationKey(datasetRunner?.runTemplateId), datasetRunner?.runTemplateId)
        : '';
    }
  }, [currentDataset, runners, t]);
  const updateDataset = useUpdateDataset();

  const datasets = useDatasets();
  const parentDatasetName = useMemo(() => {
    if (currentDataset?.parentId == null) return;
    const parentDataset = datasets?.find((dataset) => dataset.id === currentDataset?.parentId);
    return parentDataset?.name;
  }, [datasets, currentDataset?.parentId]);

  return {
    organizationId,
    workspaceId,
    dataset: currentDataset,
    updateDataset,
    selectedDatasetIndex,
    parentDatasetName,
    etlDatasetRunTemplateName,
  };
};
