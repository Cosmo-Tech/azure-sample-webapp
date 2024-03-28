// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useDownloadLogsFile } from '../../../../../../hooks/RunnerRunHooks';
import {
  useCurrentDataset,
  useCurrentDatasetId,
  useRefreshDataset,
  useRollbackTwingraphData,
} from '../../../../../../state/hooks/DatasetHooks';
import { useStopRunner } from '../../../../../../state/hooks/RunnerHooks';

export const useDatasetOverviewPlaceholder = () => {
  const currentDataset = useCurrentDataset();
  const currentDatasetIngestionStatus = currentDataset?.ingestionStatus;
  const currentDatasetTwincacheStatus = currentDataset?.twincacheStatus;
  const currentDatasetType = currentDataset?.sourceType;
  const currentDatasetId = useCurrentDatasetId();
  const refreshDataset = useRefreshDataset();
  const rollbackTwingraphData = useRollbackTwingraphData();
  const downloadLogsFile = useDownloadLogsFile();
  const stopRunner = useStopRunner();
  return {
    currentDatasetId,
    currentDatasetIngestionStatus,
    currentDatasetTwincacheStatus,
    refreshDataset,
    rollbackTwingraphData,
    downloadLogsFile,
    stopRunner,
    currentDatasetType,
  };
};
