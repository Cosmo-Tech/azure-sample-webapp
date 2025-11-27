// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button, Grid, Link, Typography } from '@mui/material';
import { NATIVE_DATASOURCE_TYPES, RUNNER_RUN_STATE } from '../../../../../../services/config/ApiConstants';
import { ApiUtils } from '../../../../../../utils';
import { ReuploadFileDatasetButton } from '../../../ReuploadFileDatasetButton';
import { useDatasetOverviewPlaceholder } from './DatasetOverviewPlaceholderHook';

export const DatasetOverviewPlaceholder = () => {
  const { t } = useTranslation();
  const {
    currentDatasetId,
    currentDatasetStatus,
    currentDatasetType,
    refreshDataset,
    downloadLogsFile,
    rollbackTwingraphData,
    stopETLRunner,
  } = useDatasetOverviewPlaceholder();

  const placeholderLabels = useMemo(() => {
    let title = null;
    let subtitle = null;
    let subtitleDataCy = 'dataset-overview-subtitle';
    if (currentDatasetId == null)
      title = t(
        'commoncomponents.datasetmanager.overview.placeholder.noDatasetSelected',
        'No dataset selected. You can select a dataset in the left-side panel.'
      );

    switch (currentDatasetStatus) {
      case RUNNER_RUN_STATE.SUCCESSFUL:
        title = t('commoncomponents.datasetmanager.overview.placeholder.noKpis.title', 'Your dataset is ready');
        subtitle = t(
          'commoncomponents.datasetmanager.overview.placeholder.noKpis.subtitle',
          'You can use it to create new scenarios'
        );
        break;
      case RUNNER_RUN_STATE.RUNNING:
        title = t(
          'commoncomponents.datasetmanager.overview.placeholder.loading',
          'Importing your data, please wait...'
        );
        break;
      case RUNNER_RUN_STATE.CREATED:
        subtitleDataCy = 'dataset-overview-api-link';
        title = t('commoncomponents.datasetmanager.overview.placeholder.empty', 'Your dataset is empty');
        subtitle = (
          // This component uses node count to implement a link in the translation string,
          // if the string is modified, need to check that the link is still the node N1
          <Trans i18nKey="commoncomponents.datasetmanager.overview.placeholder.apiLink">
            You can use the
            <Link href={ApiUtils.getDatasetTwingraphSwaggerSection()} target="blank" sx={{ color: 'inherit' }}>
              Cosmo Tech API
            </Link>
            to populate it
          </Trans>
        );
        break;
      case RUNNER_RUN_STATE.FAILED:
        title = t(
          'commoncomponents.datasetmanager.overview.placeholder.error',
          'An error occurred during import of your data'
        );
        break;
      case RUNNER_RUN_STATE.UNKNOWN:
      default:
        title = t(
          'commoncomponents.datasetmanager.overview.placeholder.unknown',
          'The dataset has an unknown state, if the problem persists, please, contact your administrator'
        );
    }

    return {
      title: (
        <Typography data-cy="dataset-overview-title" variant="h5" align="center">
          {title}
        </Typography>
      ),
      subtitle: subtitle ? (
        <Typography data-cy={subtitleDataCy} variant="body1" color="appbar.contrastTextSoft">
          {subtitle}
        </Typography>
      ) : null,
    };
  }, [currentDatasetId, currentDatasetStatus, t]);

  const buttonRow = useMemo(() => {
    if (
      currentDatasetId == null ||
      !currentDatasetStatus ||
      ![RUNNER_RUN_STATE.FAILED, RUNNER_RUN_STATE.UNKNOWN, RUNNER_RUN_STATE.RUNNING].includes(currentDatasetStatus)
    )
      return null;

    const abortButton = (
      <Button
        data-cy="dataset-overview-abort-button"
        variant="contained"
        color="error"
        onClick={() => stopETLRunner(currentDatasetId)}
      >
        {t('commoncomponents.datasetmanager.overview.placeholder.abortButton', 'Abort')}
      </Button>
    );

    const runLogsDownloadButton = (
      <Button
        sx={{ mr: 1 }}
        data-cy={'runner-run-logs-download-button'}
        color={'inherit'}
        variant="outlined"
        startIcon={<InfoOutlinedIcon />}
        onClick={downloadLogsFile}
      >
        {t('commoncomponents.iframe.scenario.results.button.logs', 'Logs')}
      </Button>
    );

    const retryButton = (
      <Button
        data-cy="dataset-overview-retry-button"
        variant="contained"
        onClick={() => refreshDataset(currentDatasetId)}
      >
        {t('commoncomponents.datasetmanager.overview.placeholder.retryButton', 'Retry')}
      </Button>
    );

    // FIXME: remove rollback button & associated code
    // showRollbackButton=currentDatasetTwincacheStatus === TWINCACHE_STATUS.FULL && currentDatasetType !== 'ETL';
    const showRollbackButton = false;
    const rollBackButton = showRollbackButton ? (
      <Button
        data-cy="dataset-overview-rollback-button"
        variant="contained"
        onClick={() => rollbackTwingraphData(currentDatasetId)}
        sx={{ ml: 1 }}
      >
        {t('commoncomponents.datasetmanager.overview.placeholder.rollbackButton', 'Rollback')}
      </Button>
    ) : null;

    if (currentDatasetStatus === RUNNER_RUN_STATE.RUNNING)
      return !Object.values(NATIVE_DATASOURCE_TYPES).includes(currentDatasetType) && abortButton;
    else if (currentDatasetType === NATIVE_DATASOURCE_TYPES.FILE_UPLOAD)
      return <ReuploadFileDatasetButton datasetId={currentDatasetId} iconButton={false} />;
    else
      return (
        <>
          {!Object.values(NATIVE_DATASOURCE_TYPES).includes(currentDatasetType) && runLogsDownloadButton}
          {retryButton}
          {rollBackButton}
        </>
      );
  }, [
    currentDatasetId,
    currentDatasetStatus,
    refreshDataset,
    rollbackTwingraphData,
    stopETLRunner,
    currentDatasetType,
    downloadLogsFile,
    t,
  ]);

  return (
    <Grid
      data-cy="dataset-overview-placeholder"
      container
      direction="column"
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: buttonRow != null ? 4 : 2,
        height: '100%',
        width: 'fill-available',
      }}
    >
      <Grid>{placeholderLabels.title}</Grid>
      {buttonRow && <Grid>{buttonRow}</Grid>}
      {placeholderLabels.subtitle && <Grid>{placeholderLabels.subtitle}</Grid>}
    </Grid>
  );
};
