// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useFormState } from 'react-hook-form';
import { useDownloadLogsFile } from '../../../../hooks/ScenarioRunHooks';
import {
  useCurrentScenarioLastRun,
  useCurrentScenarioLastUpdate,
  useCurrentScenarioState,
} from '../../../../state/hooks/ScenarioHooks';
import { useCurrentScenarioRunStartTime } from '../../../../state/hooks/ScenarioRunHooks';
import { useWorkspaceData } from '../../../../state/hooks/WorkspaceHooks';

export const useScenarioDashboardCard = () => {
  const currentScenarioLastUpdate = useCurrentScenarioLastUpdate();
  const currentScenarioLastRun = useCurrentScenarioLastRun();
  const currentScenarioState = useCurrentScenarioState();
  const currentScenarioRunStartTime = useCurrentScenarioRunStartTime();
  const downloadCurrentScenarioRunLogs = useDownloadLogsFile();
  const workspace = useWorkspaceData();

  const { isDirty } = useFormState();

  const hasRunBeenSuccessful = useMemo(
    () => currentScenarioLastRun !== null && currentScenarioState === 'Successful',
    [currentScenarioLastRun, currentScenarioState]
  );

  const isDashboardSync = useMemo(() => {
    const disableOutOfSyncWarningBanner = workspace?.webApp?.options?.disableOutOfSyncWarningBanner === true;
    if (disableOutOfSyncWarningBanner || !currentScenarioRunStartTime) return true;
    if (isDirty) return false;

    const lastUpdate = new Date(currentScenarioLastUpdate);
    const startTime = new Date(currentScenarioRunStartTime);
    lastUpdate.setSeconds(0);
    lastUpdate.setMilliseconds(0);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);
    return lastUpdate <= startTime;
  }, [
    currentScenarioLastUpdate,
    currentScenarioRunStartTime,
    isDirty,
    workspace?.webApp?.options?.disableOutOfSyncWarningBanner,
  ]);

  return { hasRunBeenSuccessful, isDashboardSync, downloadCurrentScenarioRunLogs };
};
