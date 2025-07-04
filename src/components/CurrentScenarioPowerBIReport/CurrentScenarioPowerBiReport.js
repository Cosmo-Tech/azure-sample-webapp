// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Backdrop, Box, CircularProgress, Stack, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ErrorBoundary, SimplePowerBIReportEmbed } from '@cosmotech/ui';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
import { useCurrentScenarioPowerBiReport } from './CurrentScenarioPowerBiReportHook';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    position: 'absolute',
    color: '#fff',
    zIndex: theme.zIndex.drawer + 1,
  },
}));

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
  const classes = useStyles();
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

  const showLoadingBackdrop =
    (currentScenarioData?.state === RUNNER_RUN_STATE.SUCCESSFUL || alwaysShowReports === true) &&
    isPowerBIReducerLoading &&
    !isParentLoading;

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Backdrop data-cy="charts-backdrop" open={showLoadingBackdrop} className={classes.backdrop}>
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
