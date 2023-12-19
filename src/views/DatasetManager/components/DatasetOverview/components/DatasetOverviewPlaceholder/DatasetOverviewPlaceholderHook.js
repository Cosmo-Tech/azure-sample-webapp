// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentDataset,
  useCurrentDatasetId,
  useRefreshDataset,
  useRollbackTwingraphData,
} from '../../../../../../state/hooks/DatasetHooks';

export const useDatasetOverviewPlaceholder = () => {
  const currentDataset = useCurrentDataset();
  const currentDatasetIngestionStatus = currentDataset?.ingestionStatus;
  const currentDatasetTwincacheStatus = currentDataset?.twincacheStatus;
  const currentDatasetId = useCurrentDatasetId();
  const refreshDataset = useRefreshDataset();
  const rollbackTwingraphData = useRollbackTwingraphData();
  return {
    currentDatasetId,
    currentDatasetIngestionStatus,
    currentDatasetTwincacheStatus,
    refreshDataset,
    rollbackTwingraphData,
  };
};
