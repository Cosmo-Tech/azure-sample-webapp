// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import {
  useCurrentDataset,
  useSelectedDatasetIndex,
  useUpdateDataset,
} from '../../../../../../state/hooks/DatasetHooks';

export const useEditableDatasetName = () => {
  const currentDataset = useCurrentDataset();
  const selectedDatasetIndex = useSelectedDatasetIndex();
  const updateDataset = useUpdateDataset();

  const renameDataset = useCallback(
    (newDatasetName) => {
      if (!currentDataset) return;
      updateDataset(currentDataset.id, { name: newDatasetName }, selectedDatasetIndex);
    },
    [currentDataset, selectedDatasetIndex, updateDataset]
  );

  return {
    dataset: currentDataset,
    datasetName: currentDataset?.name,
    renameDataset,
  };
};
