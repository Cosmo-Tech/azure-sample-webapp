// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDownloadLogsFile } from '../../hooks/ScenarioRunHooks';
import { useIsDarkTheme } from '../../state/hooks/ApplicationHooks';
import { usePowerBIInfo } from '../../state/hooks/PowerBIHooks';
import { useCurrentScenarioData, useScenarios } from '../../state/hooks/ScenarioHooks';
import { useWorkspaceChartsLogInWithUserCredentials } from '../../state/hooks/WorkspaceHooks';
import darkTheme from '../../theme/powerbi/darkTheme.json';
import lightTheme from '../../theme/powerbi/lightTheme.json';
import { getReportLabels } from './labels';

export const useCurrentScenarioPowerBiReport = () => {
  const { t, i18n } = useTranslation();

  const currentScenarioData = useCurrentScenarioData();
  const scenarios = useScenarios();
  const reports = usePowerBIInfo();
  const logInWithUserCredentials = useWorkspaceChartsLogInWithUserCredentials();
  const downloadLogsFile = useDownloadLogsFile();

  const reportLabels = useMemo(() => getReportLabels(t), [t]);
  const language = useMemo(() => i18n.language, [i18n.language]);

  const visibleScenarios = useMemo(
    () =>
      scenarios.map((scenario) => ({
        id: scenario.id,
        runId: scenario.lastRun?.scenarioRunId,
        csmSimulationRun: scenario.lastRun?.csmSimulationRun,
      })),
    [scenarios]
  );

  const isDarkTheme = useIsDarkTheme();
  const theme = useMemo(() => (isDarkTheme ? darkTheme : lightTheme), [isDarkTheme]);

  return {
    currentScenarioData,
    visibleScenarios,
    reportLabels,
    reports,
    language,
    downloadLogsFile,
    logInWithUserCredentials,
    theme,
  };
};
