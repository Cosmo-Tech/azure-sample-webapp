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
  const currentDatasetType = DatasetsUtils.getDatasetOption(currentDataset, 'sourceType');
  const currentDatasetId = useCurrentDatasetId();
  const refreshDataset = useRefreshDataset();
  const rollbackTwingraphData = useRollbackTwingraphData();
  const downloadLogsFile = useDownloadLogsFile();
  const stopETLRunner = useStopETLRunner();

  const getDatasetRunnerStatus = useGetDatasetRunnerStatus();
  const currentDatasetStatus = useMemo(() => {
    return currentDatasetType === 'ETL' ? getDatasetRunnerStatus(currentDataset) : RUNNER_RUN_STATE.SUCCESSFUL;
  }, [currentDataset, currentDatasetType, getDatasetRunnerStatus]);

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
