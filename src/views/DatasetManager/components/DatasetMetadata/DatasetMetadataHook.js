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
} from '../../../../state/hooks/DatasetHooks';
import { useGetETLRunners } from '../../../../state/hooks/RunnerHooks';
import { TranslationUtils } from '../../../../utils';

export const useDatasetMetadata = () => {
  const { t } = useTranslation();
  const currentDataset = useCurrentDataset();
  const selectedDatasetIndex = useSelectedDatasetIndex();
  const runners = useGetETLRunners();

  const etlDatasetRunTemplateName = useMemo(() => {
    if (currentDataset?.sourceType === 'ETL') {
      const datasetRelatedRunner = runners.find((runner) => runner.id === currentDataset?.source?.name) || null;
      return datasetRelatedRunner
        ? t(
            TranslationUtils.getRunTemplateTranslationKey(datasetRelatedRunner?.runTemplateId),
            datasetRelatedRunner?.runTemplateId
          )
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
