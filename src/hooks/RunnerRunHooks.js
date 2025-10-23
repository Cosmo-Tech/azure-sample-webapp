// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import RunnerRunService from '../services/runnerRun/RunnerRunService';
import { useCurrentDataset } from '../state/datasets/hooks';
import { useOrganizationId } from '../state/organizations/hooks';
import { useCurrentSimulationRunnerData, useRunner } from '../state/runner/hooks';
import { useWorkspaceId } from '../state/workspaces/hooks';
import { RunnersUtils } from '../utils';

export const useDownloadLogsFile = () => {
  const organizationId = useOrganizationId();
  const currentDataset = useCurrentDataset();
  const workspaceId = currentDataset?.workspaceId;
  const runnerId = currentDataset?.createInfo?.runnerId;

  const runner = useRunner(runnerId);
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
