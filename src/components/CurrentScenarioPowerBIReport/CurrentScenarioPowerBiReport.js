// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { SimplePowerBIReportEmbed } from '@cosmotech/ui';
import { USE_POWER_BI_WITH_USER_CREDENTIALS } from '../../config/PowerBI';

import { useCurrentScenarioPowerBiReport } from './CurrentScenarioPowerBiReportHook';

const CurrentScenarioPowerBiReport = ({ reportConfiguration, iframeRatio, index }) => {
  const { currentScenarioData, downloadLogsFile, language, reportLabels, reports } = useCurrentScenarioPowerBiReport();

  return (
    <SimplePowerBIReportEmbed
      reports={reports}
      reportConfiguration={reportConfiguration}
      scenario={currentScenarioData}
      lang={language}
      downloadLogsFile={downloadLogsFile}
      labels={reportLabels}
      useAAD={USE_POWER_BI_WITH_USER_CREDENTIALS}
      iframeRatio={iframeRatio}
      index={index}
    />
  );
};

CurrentScenarioPowerBiReport.propTypes = {
  reportConfiguration: SimplePowerBIReportEmbed.propTypes.reportConfiguration,
  iframeRatio: SimplePowerBIReportEmbed.propTypes.iframeRatio,
  index: SimplePowerBIReportEmbed.propTypes.index,
};

export default CurrentScenarioPowerBiReport;
