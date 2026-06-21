// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Backdrop, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { ErrorBoundary, SupersetReport } from '@cosmotech/ui';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants';
import { STATUSES } from '../../services/config/StatusConstants';
import { RunnersUtils } from '../../utils';
import StyledErrorContainer from '../StyledErrorContainer';
import { useCurrentScenarioSupersetReport } from './CurrentScenarioSupersetReportHook';

const SCROLL_SIZE_POLL_DELAY_MS = 1500;

const CurrentScenarioSupersetReport = ({
  isInScenarioViewContext = false,
  isParentLoading = false,
  index,
  labels,
  ...other
}) => {
  const { t } = useTranslation();

  const {
    currentScenarioData,
    downloadLogsFile,
    getSupersetReportWithScenarioContext,
    guestToken,
    isSupersetDisabled,
    isSupersetReducerLoading,
    options,
    reportLabels,
    supersetInfo,
    visibleScenarios,
  } = useCurrentScenarioSupersetReport();

  const { report, noDashboardConfiguredForRunTemplate, alwaysShowReports } =
    getSupersetReportWithScenarioContext(index);

  const defaultErrorDescription =
    'Something went wrong when trying to display dashboards. If the problem ' +
    'persists, please contact an administrator.';
  const showErrorBanner = supersetInfo?.status === STATUSES.ERROR;
  const errorTitle =
    supersetInfo?.error?.title ||
    supersetInfo?.error?.status ||
    t('commoncomponents.iframe.errorPlaceholder.title', 'Unexpected error');
  const errorDescription =
    supersetInfo?.error?.message ||
    supersetInfo?.error?.description ||
    t('commoncomponents.iframe.errorPlaceholder.description', defaultErrorDescription);

  const scenarioStatus = RunnersUtils.getLastRunStatus(currentScenarioData);
  const showLoadingBackdrop =
    (scenarioStatus === RUNNER_RUN_STATE.SUCCESSFUL || alwaysShowReports === true) &&
    isSupersetReducerLoading &&
    guestToken.value === '' &&
    !isParentLoading;
  const hasGuestTokenFetchFailed = guestToken?.status === STATUSES.ERROR;

  // Auto-height embedding for Dashboards view (not Scenario view)
  const autoHeightContainerRef = useRef(null);
  const tokenRef = useRef('');
  const isEmbeddedRef = useRef(false);
  const [iframeHeight, setIframeHeight] = useState(null);

  useEffect(() => {
    if (guestToken.status === STATUSES.SUCCESS && guestToken.value) {
      tokenRef.current = guestToken.value;
    }
  }, [guestToken.status, guestToken.value]);

  const uiConfigKey = JSON.stringify(report?.uiConfig);

  useEffect(() => {
    if (isInScenarioViewContext) return;
    if (!report?.id || !options?.supersetUrl) return;
    if (guestToken.status !== STATUSES.SUCCESS) return;
    if (!autoHeightContainerRef.current || isEmbeddedRef.current) return;

    let mounted = true;
    let dashboard = null;

    const embed = async () => {
      try {
        dashboard = await embedDashboard({
          id: report.id,
          supersetDomain: options.supersetUrl,
          mountPoint: autoHeightContainerRef.current,
          fetchGuestToken: () => Promise.resolve(tokenRef.current),
          dashboardUiConfig: report.uiConfig ?? {},
        });
        if (!mounted) {
          dashboard?.destroy?.();
          return;
        }
        isEmbeddedRef.current = true;
        setTimeout(async () => {
          if (!mounted) return;
          try {
            const size = await dashboard.getScrollSize();
            if (size?.height > 0) setIframeHeight(`${Math.ceil(size.height)}px`);
          } catch (e) {
            console.warn('CurrentScenarioSupersetReport: getScrollSize failed, using fallback height', e);
          }
        }, SCROLL_SIZE_POLL_DELAY_MS);
      } catch (e) {
        console.error('CurrentScenarioSupersetReport: embed failed:', e);
      }
    };

    embed();

    return () => {
      mounted = false;
      isEmbeddedRef.current = false;
      setIframeHeight(null);
      dashboard?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInScenarioViewContext, report?.id, uiConfigKey, options?.supersetUrl, guestToken.status]);

  if (!isInScenarioViewContext) {
    const fallbackHeight = report?.height ?? '800px';
    const showSpinner = guestToken.status !== STATUSES.ERROR && !isEmbeddedRef.current;
    return (
      <Box sx={{ width: report?.width ?? '100%', height: iframeHeight ?? fallbackHeight, position: 'relative' }}>
        <Backdrop
          open={showSpinner}
          sx={{ position: 'absolute', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box
          ref={autoHeightContainerRef}
          sx={{ width: '100%', height: '100%', '& iframe': { width: '100%', height: '100%', border: 'none' } }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', position: 'relative', pb: showErrorBanner ? '10px' : 0, minHeight: '50px' }}>
      {showErrorBanner && (
        <StyledErrorContainer
          data-cy="superset-error-banner"
          isInScenarioViewContext={isInScenarioViewContext}
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
            alwaysShowReports={alwaysShowReports && !isInScenarioViewContext && !hasGuestTokenFetchFailed}
            disabled={isSupersetDisabled}
            isParentLoading={showLoadingBackdrop}
            downloadLogsFile={downloadLogsFile}
            guestToken={guestToken}
            labels={{ ...reportLabels, ...labels }}
            noDashboardConfigured={noDashboardConfiguredForRunTemplate}
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
  isInScenarioViewContext: PropTypes.bool,
  isParentLoading: PropTypes.bool,
  index: PropTypes.number,
  labels: PropTypes.object,
};

export default CurrentScenarioSupersetReport;
