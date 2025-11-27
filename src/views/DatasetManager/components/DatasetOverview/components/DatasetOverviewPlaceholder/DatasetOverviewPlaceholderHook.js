// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useGetDatasetRunnerStatus } from '../../../../../../hooks/DatasetRunnerHooks';
import { useDownloadLogsFile } from '../../../../../../hooks/RunnerRunHooks';
import { RUNNER_RUN_STATE } from '../../../../../../services/config/ApiConstants';
import {
  useCurrentDataset,
  useCurrentDatasetId,
  useRefreshDataset,
  useRollbackTwingraphData,
} from '../../../../../../state/datasets/hooks';
import { useStopETLRunner } from '../../../../../../state/runner/hooks';
import { DatasetsUtils } from '../../../../../../utils';

export const useDatasetOverviewPlaceholder = () => {
  const currentDataset = useCurrentDataset();
  const currentDatasetType = currentDataset?.additionalData?.webapp?.sourceType;
  const currentDatasetId = useCurrentDatasetId();
  const refreshDataset = useRefreshDataset();
  const rollbackTwingraphData = useRollbackTwingraphData();
  const downloadLogsFile = useDownloadLogsFile();
  const stopETLRunner = useStopETLRunner();

  const getDatasetRunnerStatus = useGetDatasetRunnerStatus();
  const currentDatasetStatus = useMemo(() => {
    if (DatasetsUtils.getDatasetOption(currentDataset, 'sourceType') === 'ETL')
      return getDatasetRunnerStatus(currentDataset);
    return RUNNER_RUN_STATE.SUCCESSFUL;
  }, [currentDataset, getDatasetRunnerStatus]);

  return {
    currentDatasetId,
    currentDatasetStatus,
    refreshDataset,
    rollbackTwingraphData,
    downloadLogsFile,
    stopETLRunner,
    currentDatasetType,
  };
};
