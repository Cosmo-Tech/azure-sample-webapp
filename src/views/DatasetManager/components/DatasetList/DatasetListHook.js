// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ResourceUtils } from '@cosmotech/core';
import {
  useCurrentDataset,
  useDatasetListData,
  useDeleteDataset,
  useRefreshDataset,
  useSelectDataset,
} from '../../../../state/hooks/DatasetHooks';

export const useDatasetList = () => {
  const datasetList = useDatasetListData()?.filter((dataset) => dataset.main === true);
  const sortedDatasetList = ResourceUtils.getResourceTree(datasetList);
  const selectDataset = useSelectDataset();
  const currentDataset = useCurrentDataset();

  const deleteDataset = useDeleteDataset();
  const refreshDatasetById = useRefreshDataset();
  return { sortedDatasetList, currentDataset, selectDataset, deleteDataset, refreshDatasetById };
};
