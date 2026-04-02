// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useFormState } from 'react-hook-form';
import {
  useOverridableCurrentScenarioId,
  useOverridableCurrentScenarioLastRun,
  useOverridableCurrentScenarioLastRunId,
  useOverridableCurrentScenarioLastRunStatus,
  useOverridableCurrentScenarioLastUpdate,
} from '../../../../hooks/OverridableScenarioHooks';
import { useDownloadSimulationLogsFile } from '../../../../hooks/RunnerRunHooks';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { useWorkspaceData } from '../../../../state/workspaces/hooks';

export const useScenarioDashboardCard = () => {
  const currentScenarioLastUpdate = useOverridableCurrentScenarioLastUpdate();
  const currentScenarioId = useOverridableCurrentScenarioId();
  const currentScenarioLastRun = useOverridableCurrentScenarioLastRun(currentScenarioId);
  const currentScenarioLastRunId = useOverridableCurrentScenarioLastRunId();
  const currentScenarioLastRunStatus = useOverridableCurrentScenarioLastRunStatus();
  const downloadCurrentScenarioRunLogs = useDownloadSimulationLogsFile();
  const workspace = useWorkspaceData();

  const { isDirty } = useFormState();
  const hasRunBeenSuccessful = useMemo(
    () => currentScenarioLastRunId !== null && currentScenarioLastRunStatus === RUNNER_RUN_STATE.SUCCESSFUL,
    [currentScenarioLastRunId, currentScenarioLastRunStatus]
  );

  const isDashboardSync = useMemo(() => {
    // Since v7, banner is disabled by default, it must be enabled by setting disableOutOfSyncWarningBanner to false
    const disableOutOfSyncWarningBanner = workspace?.additionalData?.webapp?.disableOutOfSyncWarningBanner !== false;
    if (disableOutOfSyncWarningBanner || currentScenarioLastRun?.startTime == null) return true;
    if (isDirty) return false;

    const lastUpdate = new Date(currentScenarioLastUpdate);
    const startTime = new Date(currentScenarioLastRun?.startTime);
    lastUpdate.setSeconds(0);
    lastUpdate.setMilliseconds(0);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);
    return lastUpdate <= startTime;
  }, [
    currentScenarioLastUpdate,
    currentScenarioLastRun,
    isDirty,
    workspace?.additionalData?.webapp?.disableOutOfSyncWarningBanner,
  ]);

  return { hasRunBeenSuccessful, isDashboardSync, downloadCurrentScenarioRunLogs };
};
