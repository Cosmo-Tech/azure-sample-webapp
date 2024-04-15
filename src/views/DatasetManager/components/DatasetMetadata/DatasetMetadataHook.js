// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import {
  useCurrentDataset,
  useDatasets,
  useUpdateDataset,
  useSelectedDatasetIndex,
} from '../../../../state/hooks/DatasetHooks';

export const useDatasetMetadata = () => {
  const currentDataset = useCurrentDataset();
  const selectedDatasetIndex = useSelectedDatasetIndex();
  const updateDataset = useUpdateDataset();

  const datasets = useDatasets();
  const parentDatasetName = useMemo(() => {
    if (currentDataset?.parentId == null) return;
    const parentDataset = datasets?.find((dataset) => dataset.id === currentDataset?.parentId);
    return parentDataset?.name;
  }, [datasets, currentDataset?.parentId]);

  return { dataset: currentDataset, updateDataset, selectedDatasetIndex, parentDatasetName };
};
