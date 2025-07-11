// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDownloadSimulationLogsFile } from '../../hooks/RunnerRunHooks';
import { STATUSES } from '../../services/config/StatusConstants';
import { useIsDarkTheme } from '../../state/app/hooks';
import { usePowerBIInfo, usePowerBIReducerStatus } from '../../state/powerBi/hooks';
import { useCurrentSimulationRunnerData, useRunners } from '../../state/runner/hooks';
import { useWorkspaceChartsLogInWithUserCredentials } from '../../state/workspaces/hooks';
import darkTheme from '../../theme/powerbi/darkTheme.json';
import lightTheme from '../../theme/powerbi/lightTheme.json';
import { RunnersUtils } from '../../utils';
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
      scenarios?.map((runner) => ({
        id: runner.id,
        runId: RunnersUtils.getLastRunId(runner),
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
