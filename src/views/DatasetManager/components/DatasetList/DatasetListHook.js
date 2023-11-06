// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ResourceUtils } from '@cosmotech/core';
import {
  useCurrentDataset,
  useDeleteDataset,
  useMainDatasetListData,
  useRefreshDataset,
  useSelectDataset,
} from '../../../../state/hooks/DatasetHooks';

export const useDatasetList = () => {
  const datasetList = useMainDatasetListData();
  const sortedDatasetList = ResourceUtils.getResourceTree(datasetList);
  const currentDataset = useCurrentDataset();
  const selectDataset = useSelectDataset();
  if (currentDataset == null) selectDataset(sortedDatasetList?.[0] ?? null);

  const deleteDataset = useDeleteDataset();
  const refreshDatasetById = useRefreshDataset();
  return { sortedDatasetList, currentDataset, selectDataset, deleteDataset, refreshDatasetById };
};
