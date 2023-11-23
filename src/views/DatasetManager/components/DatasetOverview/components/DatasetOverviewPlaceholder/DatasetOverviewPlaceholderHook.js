// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCurrentDataset, useCurrentDatasetId, useRefreshDataset } from '../../../../../../state/hooks/DatasetHooks';

export const useDatasetOverviewPlaceholder = () => {
  const currentDatasetStatus = useCurrentDataset()?.status;
  const currentDatasetId = useCurrentDatasetId();
  const refreshDataset = useRefreshDataset();
  return { currentDatasetId, currentDatasetStatus, refreshDataset };
};
