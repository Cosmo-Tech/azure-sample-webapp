// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useDownloadLogsFile } from '../../../../../../hooks/RunnerRunHooks';
import {
  useCurrentDataset,
  useCurrentDatasetId,
  useRefreshDataset,
  useRollbackTwingraphData,
} from '../../../../../../state/datasets/hooks';
import { useStopRunner } from '../../../../../../state/runner/hooks';

export const useDatasetOverviewPlaceholder = () => {
  const currentDataset = useCurrentDataset();
  // FIXME: read status of the associated runner
  const currentDatasetIngestionStatus = currentDataset?.ingestionStatus;
  const currentDatasetTwincacheStatus = currentDataset?.twincacheStatus;
  // FIXME: read sourceType from additionalData when it's available
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
