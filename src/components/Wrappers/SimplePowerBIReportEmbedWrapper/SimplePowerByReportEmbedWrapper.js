// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { SimplePowerBIReportEmbed } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';

import ScenarioRunService from '../../../services/scenarioRun/ScenarioRunService';
import {
  SCENARIO_DASHBOARD_CONFIG,
  USE_POWER_BI_WITH_USER_CREDENTIALS,
  SCENARIO_VIEW_IFRAME_DISPLAY_RATIO,
} from '../../../config/PowerBI';
import { LOG_TYPES } from '../../../services/scenarioRun/ScenarioRunConstants';
import { SCENARIO_RUN_LOG_TYPE } from '../../../services/config/FunctionalConstants';
import { getReportLabels } from './labels';
import { useCurrentScenario } from '../../../state/hooks/ScenarioHooks';
import { usePowerBIInfo } from '../../../state/hooks/PowerBIHooks';

const SimplePowerBIReportEmbedWrapper = () => {
  const { t, i18n } = useTranslation();

  const currentScenario = useCurrentScenario();
  const reports = usePowerBIInfo();

  // Get the right report for given run template
  const currentScenarioRunTemplateReport = Array.isArray(SCENARIO_DASHBOARD_CONFIG)
    ? SCENARIO_DASHBOARD_CONFIG
    : currentScenario?.data?.runTemplateId in SCENARIO_DASHBOARD_CONFIG
    ? [SCENARIO_DASHBOARD_CONFIG[currentScenario.data.runTemplateId]]
    : [];

  const downloadLogsFile = () => {
    return ScenarioRunService.downloadLogsFile(currentScenario.data?.lastRun, LOG_TYPES[SCENARIO_RUN_LOG_TYPE]);
  };

  const reportLabels = getReportLabels(t);

  return (
    <SimplePowerBIReportEmbed
      // key is used here to assure the complete re-rendering of the component when scenario changes ; we
      // need to remount it to avoid errors in powerbi-client-react which throws an error if filters change
      key={currentScenario?.data?.id}
      reports={reports}
      reportConfiguration={currentScenarioRunTemplateReport}
      scenario={currentScenario.data}
      lang={i18n.language}
      downloadLogsFile={currentScenario.data?.lastRun ? downloadLogsFile : null}
      labels={reportLabels}
      useAAD={USE_POWER_BI_WITH_USER_CREDENTIALS}
      iframeRatio={SCENARIO_VIEW_IFRAME_DISPLAY_RATIO}
    />
  );
};

export default SimplePowerBIReportEmbedWrapper;
