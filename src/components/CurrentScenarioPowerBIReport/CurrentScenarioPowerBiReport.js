// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary, SimplePowerBIReportEmbed } from '@cosmotech/ui';
import { useCurrentScenarioPowerBiReport } from './CurrentScenarioPowerBiReportHook';

const CurrentScenarioPowerBiReport = ({ reportConfiguration, iframeRatio, index, ...other }) => {
  const { t } = useTranslation();
  const {
    currentScenarioData,
    visibleScenarios,
    downloadLogsFile,
    language,
    reportLabels,
    reports,
    logInWithUserCredentials,
    theme,
  } = useCurrentScenarioPowerBiReport();

  const defaultErrorDescription =
    'Something went wrong when trying to display PowerBI dashboards. If the problem ' +
    'persists, please contact an administrator.';

  return (
    <ErrorBoundary
      title={t('commoncomponents.iframe.errorPlaceholder.title', 'Unexpected error')}
      description={t('commoncomponents.iframe.errorPlaceholder.description', defaultErrorDescription)}
    >
      <SimplePowerBIReportEmbed
        reports={reports}
        reportConfiguration={reportConfiguration}
        scenario={currentScenarioData}
        visibleScenarios={visibleScenarios}
        lang={language}
        downloadLogsFile={downloadLogsFile}
        labels={reportLabels}
        useAAD={logInWithUserCredentials}
        iframeRatio={iframeRatio}
        index={index}
        theme={theme}
        {...other}
      />
    </ErrorBoundary>
  );
};

CurrentScenarioPowerBiReport.propTypes = {
  reportConfiguration: SimplePowerBIReportEmbed.propTypes.reportConfiguration,
  iframeRatio: SimplePowerBIReportEmbed.propTypes.iframeRatio,
  index: SimplePowerBIReportEmbed.propTypes.index,
};

export default CurrentScenarioPowerBiReport;
