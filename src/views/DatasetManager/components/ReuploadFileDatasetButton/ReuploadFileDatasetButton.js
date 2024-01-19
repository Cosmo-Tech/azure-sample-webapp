// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useReuploadFileDatasetButton } from './ReuploadFileDatasetButtonHook';
import { DatasetsUtils } from '../../../../utils';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';

export const ReuploadFileDatasetButton = ({ datasetId, confirmAndCallback }) => {
  const { organizationId, pollTwingraphStatus, updateDatasetInStore } = useReuploadFileDatasetButton();

  const handleFileUpload = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (file == null) return;

      await DatasetsUtils.uploadZipWithFetchApi(organizationId, datasetId, file);
      updateDatasetInStore(datasetId, { ingestionStatus: INGESTION_STATUS.PENDING });
      pollTwingraphStatus(datasetId);
    },
    [datasetId, organizationId, pollTwingraphStatus, updateDatasetInStore]
  );

  const openFileBrowser = useCallback((inputElementId) => document.getElementById(inputElementId).click(), []);

  const inputId = useMemo(() => `dataset-reupload-input-${datasetId}`, [datasetId]);
  return (
    <>
      <input hidden type="file" accept="application/zip" id={inputId} onChange={handleFileUpload} />
      <IconButton
        component="span"
        data-cy={`dataset-reupload-button-${datasetId}`}
        onClick={(event) => {
          event.stopPropagation();
          confirmAndCallback(event, () => openFileBrowser(inputId));
        }}
      >
        <RefreshIcon />
      </IconButton>
    </>
  );
};

ReuploadFileDatasetButton.propTypes = {
  datasetId: PropTypes.string.isRequired,
  confirmAndCallback: PropTypes.func.isRequired,
};
