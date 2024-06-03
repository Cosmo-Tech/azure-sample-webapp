// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDownloadSimulationLogsFile } from '../../hooks/RunnerRunHooks';
import { STATUSES } from '../../state/commons/Constants';
import { useIsDarkTheme } from '../../state/hooks/ApplicationHooks';
import { usePowerBIInfo, usePowerBIReducerStatus } from '../../state/hooks/PowerBIHooks';
import { useCurrentSimulationRunnerData, useRunners } from '../../state/hooks/RunnerHooks';
import { useWorkspaceChartsLogInWithUserCredentials } from '../../state/hooks/WorkspaceHooks';
import darkTheme from '../../theme/powerbi/darkTheme.json';
import lightTheme from '../../theme/powerbi/lightTheme.json';
import { getReportLabels } from './labels';

export const useCurrentScenarioPowerBiReport = () => {
  const { t, i18n } = useTranslation();

  const currentScenarioData = useCurrentSimulationRunnerData();
  const scenarios = useRunners();
  const reports = usePowerBIInfo();
  const logInWithUserCredentials = useWorkspaceChartsLogInWithUserCredentials();
  const powerBIReducerStatus = usePowerBIReducerStatus();
  const downloadLogsFile = useDownloadSimulationLogsFile();

  const isPowerBIReducerLoading = useMemo(() => powerBIReducerStatus === STATUSES.LOADING, [powerBIReducerStatus]);
  const reportLabels = useMemo(() => getReportLabels(t), [t]);
  const language = useMemo(() => i18n.language, [i18n.language]);

  const visibleScenarios = useMemo(
    () =>
      scenarios.map((runner) => ({
        id: runner.id,
        runId: runner.lastRunId,
      })),
    [scenarios]
  );

  const isDarkTheme = useIsDarkTheme();
  const theme = useMemo(() => (isDarkTheme ? darkTheme : lightTheme), [isDarkTheme]);

  return {
    currentScenarioData,
    isPowerBIReducerLoading,
    visibleScenarios,
    reportLabels,
    reports,
    language,
    downloadLogsFile,
    logInWithUserCredentials,
    theme,
  };
};
