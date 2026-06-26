// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useEffect, useMemo } from 'react';
import { useFormState } from 'react-hook-form';
import { useDownloadSimulationLogsFile } from '../../../../hooks/RunnerRunHooks';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import {
  useCurrentSimulationRunnerId,
  useCurrentSimulationRunnerLastRunDetails,
  useCurrentSimulationRunnerLastRunId,
  useCurrentSimulationRunnerLastUpdate,
  useCurrentSimulationRunnerLastRunStatus,
  useStartRunnerStatusPolling,
} from '../../../../state/runner/hooks';
import { useWorkspaceData } from '../../../../state/workspaces/hooks';

export const useScenarioDashboardCard = () => {
  const currentScenarioLastUpdate = useCurrentSimulationRunnerLastUpdate();
  const currentScenarioId = useCurrentSimulationRunnerId();
  const currentScenarioLastRunDetails = useCurrentSimulationRunnerLastRunDetails(currentScenarioId);
  const currentScenarioLastRunId = useCurrentSimulationRunnerLastRunId();
  const currentScenarioLastRunStatus = useCurrentSimulationRunnerLastRunStatus();
  const startRunnerStatusPolling = useStartRunnerStatusPolling();
  const downloadCurrentScenarioRunLogs = useDownloadSimulationLogsFile();
  const workspace = useWorkspaceData();

  const { isDirty } = useFormState();

  const hasRunBeenSuccessful = useMemo(
    () => currentScenarioLastRunId !== null && currentScenarioLastRunStatus === RUNNER_RUN_STATE.SUCCESSFUL,
    [currentScenarioLastRunId, currentScenarioLastRunStatus]
  );

  useEffect(() => {
    if (hasRunBeenSuccessful && currentScenarioLastRunDetails == null)
      startRunnerStatusPolling(currentScenarioId, currentScenarioLastRunId, false);
  }, [
    currentScenarioLastRunDetails,
    currentScenarioId,
    currentScenarioLastRunId,
    hasRunBeenSuccessful,
    startRunnerStatusPolling,
  ]);

  const isDashboardSync = useMemo(() => {
    // Since v7, banner is disabled by default, it must be enabled by setting disableOutOfSyncWarningBanner to false
    const disableOutOfSyncWarningBanner = workspace?.additionalData?.webapp?.disableOutOfSyncWarningBanner !== false;
    if (disableOutOfSyncWarningBanner || currentScenarioLastRunDetails?.startTime == null) return true;
    if (isDirty) return false;

    const lastUpdate = new Date(currentScenarioLastUpdate);
    const startTime = new Date(currentScenarioLastRunDetails?.startTime);
    // Back-end does not send startTime at millisecond precision, let's truncate both dates to second before comparison
    lastUpdate.setMilliseconds(0);
    startTime.setMilliseconds(0);
    return lastUpdate <= startTime;
  }, [
    currentScenarioLastUpdate,
    currentScenarioLastRunDetails,
    isDirty,
    workspace?.additionalData?.webapp?.disableOutOfSyncWarningBanner,
  ]);

  return { hasRunBeenSuccessful, isDashboardSync, downloadCurrentScenarioRunLogs };
};
