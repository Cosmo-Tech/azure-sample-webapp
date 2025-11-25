// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import RunnerRunService from '../services/runnerRun/RunnerRunService';
import { useCurrentDataset } from '../state/datasets/hooks';
import { useOrganizationId } from '../state/organizations/hooks';
import { useCurrentSimulationRunnerData, useGetETLRunnerById } from '../state/runner/hooks';
import { useWorkspaceId } from '../state/workspaces/hooks';
import { DatasetsUtils, RunnersUtils } from '../utils';

// Note that this function only works in the context of the dataset manager because it uses the "current dataset" and
// looks for the runner in the list of ETL runners. For the simulation view, use "useDownloadSimulationLogsFile" instead
export const useDownloadLogsFile = () => {
  const getRunner = useGetETLRunnerById();

  const organizationId = useOrganizationId();
  const currentDataset = useCurrentDataset();
  const workspaceId = currentDataset?.workspaceId;
  const runnerId = DatasetsUtils.getDatasetOption(currentDataset, 'runnerId');
  const runner = getRunner(runnerId);
  const runId = RunnersUtils.getLastRunId(runner);

  return useCallback(
    () => RunnerRunService.downloadLogsFile(organizationId, workspaceId, runnerId, runId),
    [organizationId, workspaceId, runnerId, runId]
  );
};

export const useDownloadSimulationLogsFile = () => {
  const selectedRunner = useCurrentSimulationRunnerData();
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();

  const lastRunId = RunnersUtils.getLastRunId(selectedRunner);

  return useCallback(
    () =>
      lastRunId ? RunnerRunService.downloadLogsFile(organizationId, workspaceId, selectedRunner?.id, lastRunId) : null,
    [organizationId, lastRunId, selectedRunner?.id, workspaceId]
  );
};
