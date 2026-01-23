// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDownloadSimulationLogsFile } from '../../hooks/RunnerRunHooks';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
import { STATUSES } from '../../services/config/StatusConstants';
import { useApplicationTheme } from '../../state/app/hooks';
import {
  useSupersetInfo,
  useSupersetReducerStatus,
  useSupersetGuestToken,
  useSupersetUrl,
  useGetSupersetReportWithScenarioContext,
} from '../../state/charts/hooks';
import { useCurrentSimulationRunnerData, useRunners } from '../../state/runner/hooks';
import darkTheme from '../../theme/powerbi/darkTheme.json';
import lightTheme from '../../theme/powerbi/lightTheme.json';
import { RunnersUtils } from '../../utils';
import { getReportLabels } from '../CurrentScenarioPowerBIReport/labels';

export const useCurrentScenarioSupersetReport = () => {
  const { t, i18n } = useTranslation();

  const scenarios = useRunners();
  const currentScenarioData = useCurrentSimulationRunnerData();

  const supersetInfo = useSupersetInfo();
  const supersetReducerStatus = useSupersetReducerStatus();
  const guestTokenValue = useSupersetGuestToken();
  const guestToken = { value: guestTokenValue, status: supersetReducerStatus };
  const supersetUrl = useSupersetUrl();
  const getSupersetReportWithScenarioContext = useGetSupersetReportWithScenarioContext();
  const downloadLogsFile = useDownloadSimulationLogsFile();

  const isSupersetDisabled = useMemo(() => supersetReducerStatus === STATUSES.DISABLED, [supersetReducerStatus]);
  const isSupersetReducerLoading = useMemo(() => supersetReducerStatus === STATUSES.LOADING, [supersetReducerStatus]);
  const reportLabels = useMemo(() => getReportLabels(t), [t]);
  const language = useMemo(() => i18n.language, [i18n.language]);

  const visibleScenarios = useMemo(
    () => scenarios?.filter((runner) => RunnersUtils.getLastRunStatus(runner) === RUNNER_RUN_STATE.SUCCESSFUL) ?? [],
    [scenarios]
  );

  const { isDarkTheme } = useApplicationTheme();
  const theme = useMemo(() => (isDarkTheme ? darkTheme : lightTheme), [isDarkTheme]);
  const options = useMemo(() => ({ supersetUrl }), [supersetUrl]);

  return {
    currentScenarioData,
    downloadLogsFile,
    getSupersetReportWithScenarioContext,
    guestToken,
    isSupersetDisabled,
    isSupersetReducerLoading,
    options,
    reportLabels,
    supersetInfo,
    visibleScenarios,
    // TODO: use values below to let integrators customize their superset reports
    language,
    theme,
  };
};
