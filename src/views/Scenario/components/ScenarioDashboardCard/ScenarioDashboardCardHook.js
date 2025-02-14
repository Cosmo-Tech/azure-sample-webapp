// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useFormState } from 'react-hook-form';
import { useDownloadSimulationLogsFile } from '../../../../hooks/RunnerRunHooks';
import {
  useCurrentSimulationRunnerId,
  useCurrentSimulationRunnerLastRun,
  useCurrentSimulationRunnerLastRunId,
  useCurrentSimulationRunnerLastUpdate,
  useCurrentSimulationRunnerState,
} from '../../../../state/runner/hooks';
import { useWorkspaceData } from '../../../../state/workspaces/hooks';

export const useScenarioDashboardCard = () => {
  const currentScenarioLastUpdate = useCurrentSimulationRunnerLastUpdate();
  const currentScenarioId = useCurrentSimulationRunnerId();
  const currentScenarioLastRun = useCurrentSimulationRunnerLastRun(currentScenarioId);
  const currentScenarioLastRunId = useCurrentSimulationRunnerLastRunId();
  const currentScenarioState = useCurrentSimulationRunnerState();
  const downloadCurrentScenarioRunLogs = useDownloadSimulationLogsFile();
  const workspace = useWorkspaceData();

  const { isDirty } = useFormState();
  const hasRunBeenSuccessful = useMemo(
    () => currentScenarioLastRunId !== null && currentScenarioState === 'Successful',
    [currentScenarioLastRunId, currentScenarioState]
  );
  const isDashboardSync = useMemo(() => {
    const disableOutOfSyncWarningBanner = workspace?.webApp?.options?.disableOutOfSyncWarningBanner === true;
    if (disableOutOfSyncWarningBanner || currentScenarioLastRun == null || currentScenarioLastRun.startTime == null)
      return true;
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
    workspace?.webApp?.options?.disableOutOfSyncWarningBanner,
  ]);

  return { hasRunBeenSuccessful, isDashboardSync, downloadCurrentScenarioRunLogs };
};
