// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Backdrop, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { ErrorBoundary, SupersetReport } from '@cosmotech/ui';
import { useSupersetGuestTokenRefresh } from '../../hooks/SupersetGuestTokenRefresh';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
import { STATUSES } from '../../services/config/StatusConstants';
import { RunnersUtils } from '../../utils';
import StyledErrorContainer from '../StyledErrorContainer';
import { useCurrentScenarioSupersetReport } from './CurrentScenarioSupersetReportHook';

const CurrentScenarioSupersetReport = ({
  alwaysShowReports,
  isParentLoading = false,
  reportConfiguration,
  index,
  labels,
  ...other
}) => {
  const { t } = useTranslation();

  const {
    currentScenarioData,
    disabled,
    noDashboardConfigured,
    isSupersetReducerLoading,
    report,
    guestToken,
    options,
    supersetInfo,
    visibleScenarios,
    reportLabels,
    downloadLogsFile,
  } = useCurrentScenarioSupersetReport();

  useSupersetGuestTokenRefresh();

  const defaultErrorDescription =
    'Something went wrong when trying to display dashboards. If the problem ' +
    'persists, please contact an administrator.';

  const scenarioStatus = RunnersUtils.getLastRunStatus(currentScenarioData);
  const showLoadingBackdrop =
    (scenarioStatus === RUNNER_RUN_STATE.SUCCESSFUL || alwaysShowReports === true) &&
    isSupersetReducerLoading &&
    !isParentLoading;

  const showErrorBanner = supersetInfo?.status === STATUSES.ERROR;
  const errorTitle =
    supersetInfo?.error?.title ||
    supersetInfo?.error?.status ||
    t('commoncomponents.iframe.errorPlaceholder.title', 'Unexpected error');
  const errorDescription =
    supersetInfo?.error?.message ||
    supersetInfo?.error?.description ||
    t('commoncomponents.iframe.errorPlaceholder.description', defaultErrorDescription);

  return (
    <Box sx={{ height: '100%', position: 'relative', pb: showErrorBanner ? '10px' : 0 }}>
      {showErrorBanner && (
        <StyledErrorContainer
          data-cy="superset-error-banner"
          hidden={supersetInfo.status !== STATUSES.ERROR}
          errorCode={errorTitle}
          errorDescription={errorDescription}
        />
      )}
      <Backdrop
        data-cy="charts-backdrop"
        open={showLoadingBackdrop}
        sx={{ position: 'absolute', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress data-cy="charts-loading-spinner" size={24} color="inherit" />
          <Typography data-cy="charts-loading-text" variant="h6">
            {t('commoncomponents.iframe.scenario.results.label.chartsLoading', 'Requesting access to dashboards...')}
          </Typography>
        </Stack>
      </Backdrop>

      <ErrorBoundary
        title={t('commoncomponents.iframe.errorPlaceholder.title', 'Unexpected error')}
        description={t('commoncomponents.iframe.errorPlaceholder.description', defaultErrorDescription)}
      >
        <Box sx={{ height: '100%' }}>
          <SupersetReport
            alwaysShowReports={alwaysShowReports}
            disabled={disabled}
            downloadLogsFile={downloadLogsFile}
            guestToken={guestToken}
            labels={{ ...reportLabels, ...labels }}
            noDashboardConfigured={noDashboardConfigured}
            options={options}
            report={report}
            scenario={currentScenarioData}
            visibleScenarios={visibleScenarios}
            {...other}
          />
        </Box>
      </ErrorBoundary>
    </Box>
  );
};

CurrentScenarioSupersetReport.propTypes = {
  alwaysShowReports: PropTypes.bool,
  isParentLoading: PropTypes.bool,
  reportConfiguration: PropTypes.object,
  index: PropTypes.number,
  labels: PropTypes.object,
};

export default CurrentScenarioSupersetReport;
