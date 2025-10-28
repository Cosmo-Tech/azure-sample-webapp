// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDownloadSimulationLogsFile } from '../../hooks/RunnerRunHooks';
import { STATUSES } from '../../services/config/StatusConstants';
import { useApplicationTheme } from '../../state/app/hooks';
import {
  useSupersetInfo,
  useSupersetReducerStatus,
  useSupersetGuestToken,
  useSupersetUrl,
  useCurrentSupersetDashboard,
} from '../../state/charts/hooks';
import { useCurrentSimulationRunnerData, useRunners } from '../../state/runner/hooks';
import darkTheme from '../../theme/powerbi/darkTheme.json';
import lightTheme from '../../theme/powerbi/lightTheme.json';
import { RunnersUtils } from '../../utils';
import { getReportLabels } from '../CurrentScenarioPowerBIReport/labels';

export const useCurrentScenarioSupersetReport = () => {
  const { t, i18n } = useTranslation();

  const currentScenarioData = useCurrentSimulationRunnerData();

  const scenarios = useRunners();

  const supersetInfo = useSupersetInfo();
  const supersetReducerStatus = useSupersetReducerStatus();
  const guestToken = useSupersetGuestToken();
  const supersetUrl = useSupersetUrl();
  const currentDashboard = useCurrentSupersetDashboard();

  const downloadLogsFile = useDownloadSimulationLogsFile();

  const isSupersetReducerLoading = useMemo(() => supersetReducerStatus === STATUSES.LOADING, [supersetReducerStatus]);

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
  const theme = useMemo(() => (isDarkTheme ? darkTheme : lightTheme), [isDarkTheme]);

  const report = useMemo(() => {
    if (!currentDashboard?.dashboardId) {
      return null;
    }
    const reportObj = {
      id: currentDashboard.dashboardId,
      uiConfig: currentDashboard.uiConfig || {},
    };
    return reportObj;
  }, [currentDashboard]);

  const options = useMemo(
    () => ({
      supersetUrl,
    }),
    [supersetUrl]
  );

  return {
    currentScenarioData,
    isSupersetReducerLoading,
    visibleScenarios,
    reportLabels,
    report,
    guestToken,
    options,
    language,
    downloadLogsFile,
    theme,
    supersetInfo,
  };
};
