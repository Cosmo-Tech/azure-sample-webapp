// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCurrentScenarioData } from '../../state/hooks/ScenarioHooks';
import { usePowerBIInfo } from '../../state/hooks/PowerBIHooks';

import ScenarioRunService from '../../services/scenarioRun/ScenarioRunService';
import { LOG_TYPES } from '../../services/scenarioRun/ScenarioRunConstants';
import { SCENARIO_RUN_LOG_TYPE } from '../../services/config/FunctionalConstants';

import { getReportLabels } from './labels';

export const useCurrentScenarioPowerBiReport = () => {
  const { t, i18n } = useTranslation();

  const currentScenarioData = useCurrentScenarioData();
  const reports = usePowerBIInfo();

  const downloadLogsFile = useCallback(
    () =>
      currentScenarioData?.lastRun
        ? ScenarioRunService.downloadLogsFile(currentScenarioData.lastRun, LOG_TYPES[SCENARIO_RUN_LOG_TYPE])
        : null,
    [currentScenarioData?.lastRun]
  );

  const reportLabels = useMemo(() => getReportLabels(t), [t]);
  const language = useMemo(() => i18n.language, [i18n.language]);

  return {
    currentScenarioData,
    reportLabels,
    reports,
    language,
    downloadLogsFile,
  };
};
