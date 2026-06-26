import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import IconButton from '@mui/material/IconButton';
import { FadingTooltip } from '@cosmotech/ui';
import { useDownloadETLLogs } from '../../../../../../hooks/RunnerRunHooks';
import { DatasetsUtils } from '../../../../../../utils';

export const DownloadLogsButton = ({ dataset }) => {
  const { t } = useTranslation();
  const downloadLogs = useDownloadETLLogs();
  const isDisabled = !DatasetsUtils.isCreatedByRunner(dataset);

  return (
    <div>
      <FadingTooltip
        title={t('commoncomponents.iframe.scenario.results.button.downloadLogs', 'Download logs')}
        disableInteractive
      >
        <IconButton onClick={downloadLogs} data-cy={`download-etl-dataset-logs-button`} disabled={isDisabled}>
          <FileDownloadIcon color={isDisabled ? 'disabled' : 'primary'} />
        </IconButton>
      </FadingTooltip>
    </div>
  );
};

DownloadLogsButton.propTypes = {
  dataset: PropTypes.object.isRequired,
};
