// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Backdrop, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { ErrorBanner, ErrorBoundary, SimplePowerBIReportEmbed } from '@cosmotech/ui';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
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
    hasError,
    errorForBanner,
  } = useCurrentScenarioPowerBiReport();

  const showLoadingBackdrop =
    (currentScenarioData?.state === RUNNER_RUN_STATE.SUCCESSFUL || alwaysShowReports === true) &&
    isPowerBIReducerLoading &&
    !isParentLoading;

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
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
      {hasError ? (
        <ErrorBanner error={errorForBanner} />
      ) : (
        <ErrorBoundary
          title={errorForBanner?.title || t('commoncomponents.iframe.errorPlaceholder.title', 'Unexpected error')}
          description={errorForBanner?.detail}
        >
          <SimplePowerBIReportEmbed
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
      )}
    </Box>
  );
};

CurrentScenarioPowerBiReport.propTypes = {
  alwaysShowReports: SimplePowerBIReportEmbed.propTypes.alwaysShowReports,
  isParentLoading: PropTypes.bool,
  reportConfiguration: SimplePowerBIReportEmbed.propTypes.reportConfiguration,
  iframeRatio: SimplePowerBIReportEmbed.propTypes.iframeRatio,
  index: SimplePowerBIReportEmbed.propTypes.index,
  labels: PropTypes.object,
};

export default CurrentScenarioPowerBiReport;
