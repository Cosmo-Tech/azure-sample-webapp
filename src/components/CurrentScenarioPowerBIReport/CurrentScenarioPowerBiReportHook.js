// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useCurrentScenarioData, useScenarioListData } from '../../state/hooks/ScenarioHooks';
import { usePowerBIInfo } from '../../state/hooks/PowerBIHooks';
import { useWorkspaceChartsLogInWithUserCredentials } from '../../state/hooks/WorkspaceHooks';
import { useOrganizationId } from '../../state/hooks/OrganizationHooks';

import ScenarioRunService from '../../services/scenarioRun/ScenarioRunService';
import { LOG_TYPES } from '../../services/scenarioRun/ScenarioRunConstants';
import { SCENARIO_RUN_LOG_TYPE } from '../../services/config/FunctionalConstants';

import { getReportLabels } from './labels';

export const useCurrentScenarioPowerBiReport = () => {
  const { t, i18n } = useTranslation();

  const currentScenarioData = useCurrentScenarioData();
  const scenarioListData = useScenarioListData();
  const reports = usePowerBIInfo();
  const logInWithUserCredentials = useWorkspaceChartsLogInWithUserCredentials();
  const organizationId = useOrganizationId();

  const downloadLogsFile = useCallback(
    () =>
      currentScenarioData?.lastRun
        ? ScenarioRunService.downloadLogsFile(
            organizationId,
            currentScenarioData.lastRun,
            LOG_TYPES[SCENARIO_RUN_LOG_TYPE]
          )
        : null,
    [organizationId, currentScenarioData?.lastRun]
  );

  const reportLabels = useMemo(() => getReportLabels(t), [t]);
  const language = useMemo(() => i18n.language, [i18n.language]);

  const visibleScenarios = useMemo(
    () =>
      scenarioListData.map((scenario) => ({
        id: scenario.id,
        runId: scenario.lastRun?.scenarioRunId,
        csmSimulationRun: scenario.lastRun?.csmSimulationRun,
      })),
    [scenarioListData]
  );

  return {
    currentScenarioData,
    visibleScenarios,
    reportLabels,
    reports,
    language,
    downloadLogsFile,
    logInWithUserCredentials,
  };
};
