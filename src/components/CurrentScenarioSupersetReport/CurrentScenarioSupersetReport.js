// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Backdrop, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { ErrorBoundary, SupersetEmbed } from '@cosmotech/ui';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
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

  const { currentScenarioData, isSupersetReducerLoading, report, guestToken, options } =
    useCurrentScenarioSupersetReport();

  const defaultErrorDescription =
    'Something went wrong when trying to display Superset dashboards. If the problem ' +
    'persists, please contact an administrator.';

  const showLoadingBackdrop =
    (currentScenarioData?.state === RUNNER_RUN_STATE.SUCCESSFUL || alwaysShowReports === true) &&
    isSupersetReducerLoading &&
    !isParentLoading;

  const hasSupersetDashboard = guestToken && report && options?.supersetUrl;

  return (
    <Box sx={{ height: hasSupersetDashboard ? '100vh' : '100%', position: 'relative' }}>
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
            {t('commoncomponents.iframe.scenario.results.label.chartsLoading', 'Requesting access to dashboards...')}
          </Typography>
        </Stack>
      </Backdrop>

      <ErrorBoundary
        title={t('commoncomponents.iframe.errorPlaceholder.title', 'Unexpected error')}
        description={t('commoncomponents.iframe.errorPlaceholder.description', defaultErrorDescription)}
      >
        {hasSupersetDashboard ? (
          <SupersetEmbed
            guestToken={guestToken}
            report={report}
            options={options}
            style={{ width: '100%', height: '100%' }}
            {...other}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!showLoadingBackdrop && (
              <Typography variant="body1" color="text.secondary">
                {t(
                  'commoncomponents.iframe.scenario.nodashboard.label',
                  "There isn't any dashboard configured for this run type"
                )}
              </Typography>
            )}
          </Box>
        )}
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
