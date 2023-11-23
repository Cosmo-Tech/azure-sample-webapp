// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentDataset,
  useDatasets,
  useDeleteDataset,
  useRefreshDataset,
  useSelectDataset,
} from '../../../../state/hooks/DatasetHooks';

export const useDatasetList = () => {
  const datasets = useDatasets();
  const selectDataset = useSelectDataset();
  const currentDataset = useCurrentDataset();

  const deleteDataset = useDeleteDataset();
  const refreshDatasetById = useRefreshDataset();
  return { datasets, currentDataset, selectDataset, deleteDataset, refreshDatasetById };
};
