// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import RunnerRunService from '../services/runnerRun/RunnerRunService';
import { useCurrentDataset } from '../state/datasets/hooks';
import { useOrganizationId } from '../state/organizations/hooks';
import { useCurrentSimulationRunnerData } from '../state/runner/hooks';
import { useWorkspaceId } from '../state/workspaces/hooks';
import { RunnersUtils } from '../utils';

export const useDownloadLogsFile = () => {
  const organizationId = useOrganizationId();
  const currentDataset = useCurrentDataset();
  const runnerId = currentDataset?.source?.name;
  const runnerRunId = currentDataset?.source?.jobId;
  const workspaceId = currentDataset?.source?.location;

  return useCallback(
    () => RunnerRunService.downloadLogsFile(organizationId, workspaceId, runnerId, runnerRunId),
    [organizationId, workspaceId, runnerId, runnerRunId]
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
