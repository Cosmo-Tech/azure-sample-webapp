// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { FadingTooltip } from '@cosmotech/ui';
import { useReuploadFileDatasetButton } from './ReuploadFileDatasetButtonHook';

export const ReuploadFileDatasetButton = ({ confirmAndCallback, dataset, disabled = false, iconButton = true }) => {
  const { t } = useTranslation();
  const { handleFileUpload } = useReuploadFileDatasetButton();

  const openFileBrowser = useCallback((inputElementId) => document.getElementById(inputElementId).click(), []);

  const inputId = useMemo(() => `dataset-reupload-input-${dataset?.id}`, [dataset?.id]);
  return (
    <>
      <input hidden type="file" accept="*" id={inputId} onChange={(event) => handleFileUpload(event, dataset)} />
      {iconButton ? (
        <FadingTooltip
          title={t('commoncomponents.datasetmanager.overview.actions.refreshButtonTooltip', 'Refresh')}
          disableInteractive
        >
          <IconButton
            component="span"
            data-cy={`dataset-reupload-button-${dataset?.id}`}
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              confirmAndCallback(event, () => openFileBrowser(inputId));
            }}
          >
            <RefreshIcon color={disabled ? 'disabled' : 'primary'} />
          </IconButton>
        </FadingTooltip>
      ) : (
        <Button
          data-cy={`dataset-reupload-button-${dataset?.id}`}
          disabled={disabled}
          variant="contained"
          onClick={(event) => {
            event.stopPropagation();
            openFileBrowser(inputId);
          }}
        >
          {t('commoncomponents.datasetmanager.overview.placeholder.retryButton', 'Retry')}
        </Button>
      )}
    </>
  );
};

ReuploadFileDatasetButton.propTypes = {
  dataset: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  confirmAndCallback: PropTypes.func,
  iconButton: PropTypes.bool,
};
