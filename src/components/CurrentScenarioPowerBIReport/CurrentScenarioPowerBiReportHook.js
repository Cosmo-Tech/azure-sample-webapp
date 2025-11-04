// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDownloadSimulationLogsFile } from '../../hooks/RunnerRunHooks';
import { STATUSES } from '../../services/config/StatusConstants';
import { useApplicationTheme } from '../../state/app/hooks';
import {
  usePowerBIInfo,
  usePowerBIReducerStatus,
  usePowerBIError,
  usePowerBIUseWebappTheme,
} from '../../state/charts/hooks';
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
  const powerBIError = usePowerBIError();
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

  const { isDarkTheme } = useApplicationTheme();
  const useWebappTheme = usePowerBIUseWebappTheme();

  const theme = useMemo(() => {
    if (useWebappTheme) {
      return isDarkTheme ? darkTheme : lightTheme;
    }
    return null;
  }, [useWebappTheme, isDarkTheme]);

  const powerBIInfo = usePowerBIInfo();
  const hasError = useMemo(
    () => !!((powerBIInfo?.status === STATUSES.ERROR && powerBIError) || powerBIError),
    [powerBIInfo?.status, powerBIError]
  );

  const defaultErrorDescription = t(
    'commoncomponents.iframe.errorPlaceholder.description',
    'Something went wrong when trying to display dashboards. If the problem persists, please contact an administrator.'
  );

  const errorForBanner = useMemo(() => {
    if (!powerBIError) return null;

    return {
      title: powerBIError.status || t('commoncomponents.iframe.errorPlaceholder.title', 'Unexpected error'),
      detail: powerBIError.powerBIErrorInfo || powerBIError.description || defaultErrorDescription,
    };
  }, [powerBIError, t, defaultErrorDescription]);

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
    hasError,
    errorForBanner,
  };
};
