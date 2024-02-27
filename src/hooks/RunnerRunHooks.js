// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import RunnerRunService from '../services/runnerRun/RunnerRunService';
import { useCurrentDataset } from '../state/hooks/DatasetHooks';
import { useOrganizationId } from '../state/hooks/OrganizationHooks';

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
