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
import { useGetETLRunners } from '../../../../state/runner/hooks';
import { TranslationUtils } from '../../../../utils';

export const useDatasetMetadata = () => {
  const { t } = useTranslation();
  const currentDataset = useCurrentDataset();
  const selectedDatasetIndex = useSelectedDatasetIndex();
  const runners = useGetETLRunners();

  const etlDatasetRunTemplateName = useMemo(() => {
    if (currentDataset?.sourceType === 'ETL') {
      const datasetRunner = runners.find((runner) => runner.id === currentDataset?.createInfo?.runnerId) ?? null;
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

  return { dataset: currentDataset, updateDataset, selectedDatasetIndex, parentDatasetName, etlDatasetRunTemplateName };
};
