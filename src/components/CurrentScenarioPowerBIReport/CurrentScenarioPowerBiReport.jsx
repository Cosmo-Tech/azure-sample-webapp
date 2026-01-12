// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Backdrop, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { ErrorBoundary, PowerBIReport } from '@cosmotech/ui';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
import { RunnersUtils } from '../../utils';
import StyledErrorContainer from '../StyledErrorContainer';
import { useCurrentScenarioPowerBiReport } from './CurrentScenarioPowerBiReportHook';

const CurrentScenarioPowerBiReport = ({
  alwaysShowReports,
  isParentLoading = false,
  reportConfiguration,
  iframeRatio,
  index,
  labels,
  ...other
}) => {
  const { t } = useTranslation();
  const {
    currentScenarioData,
    isPowerBIReducerLoading,
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

  const scenarioStatus = RunnersUtils.getLastRunStatus(currentScenarioData);
  const showLoadingBackdrop =
    (scenarioStatus === RUNNER_RUN_STATE.SUCCESSFUL || alwaysShowReports === true) &&
    isPowerBIReducerLoading &&
    !isParentLoading;

  const showErrorBanner = reports?.status === 'ERROR';
  const errorTitle =
    reports?.error?.status ||
    reports?.error?.statusText ||
    t('commoncomponents.iframe.errorPlaceholder.title', 'Unexpected error');
  const errorDescription =
    reports?.error?.powerBIErrorInfo ||
    reports?.error?.description ||
    t('commoncomponents.iframe.errorPlaceholder.description', defaultErrorDescription);

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      {showErrorBanner && (
        <StyledErrorContainer
          data-cy="powerbi-error-banner"
          hidden={reports.status !== 'ERROR'}
          errorCode={errorTitle}
          errorDescription={errorDescription}
        />
      )}
      <Backdrop
        data-cy="charts-backdrop"
        open={showLoadingBackdrop}
        sx={{
          position: 'absolute',
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress data-cy="charts-loading-spinner" size={24} color="inherit" />
          <Typography data-cy="charts-loading-text" variant="h6">
            {t('commoncomponents.iframe.scenario.results.label.chartsLoading', 'Requesting access to PowerBI...')}
          </Typography>
        </Stack>
      </Backdrop>
      <ErrorBoundary
        title={t('commoncomponents.iframe.errorPlaceholder.title', 'Unexpected error')}
        description={t('commoncomponents.iframe.errorPlaceholder.description', defaultErrorDescription)}
      >
        <PowerBIReport
          reports={reports}
          reportConfiguration={reportConfiguration}
          alwaysShowReports={alwaysShowReports}
          scenario={currentScenarioData}
          visibleScenarios={visibleScenarios}
          lang={language}
          downloadLogsFile={downloadLogsFile}
          labels={{ ...reportLabels, ...labels }}
          useAAD={logInWithUserCredentials}
          iframeRatio={iframeRatio}
          index={index}
          theme={theme}
          {...other}
        />
      </ErrorBoundary>
    </Box>
  );
};

CurrentScenarioPowerBiReport.propTypes = {
  alwaysShowReports: PowerBIReport.propTypes.alwaysShowReports,
  isParentLoading: PropTypes.bool,
  reportConfiguration: PowerBIReport.propTypes.reportConfiguration,
  iframeRatio: PowerBIReport.propTypes.iframeRatio,
  index: PowerBIReport.propTypes.index,
  labels: PropTypes.object,
};

export default CurrentScenarioPowerBiReport;
