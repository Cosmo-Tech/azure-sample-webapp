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

import { INGESTION_STATUS, } from '../../../../../../services/config/ApiConstants';

export const useDatasetOverviewPlaceholder = () => {
  const currentDataset = useCurrentDataset();
  // FIXME: read status of the associated runner
  // const currentDatasetIngestionStatus = currentDataset?.ingestionStatus;
  const currentDatasetIngestionStatus = INGESTION_STATUS.SUCCESS;
  const currentDatasetTwincacheStatus = currentDataset?.twincacheStatus;
  const currentDatasetType = currentDataset?.additionalData?.webapp?.sourceType;
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
