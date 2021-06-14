// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { UploadFile } from '@cosmotech/ui';
import { UploadFileUtils } from '../../UploadFileUtils';
import DatasetService from '../../../../services/dataset/DatasetService';
import { ORGANISATION_ID } from '../../../../configs/App.config';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui/src/UploadFile/StatusConstants';

const FileUpload = ({
  acceptedFileTypesToUpload,
  currentDataset,
  datasetId,
  workspaceId,
  file,
  setFile,
  scenarioId,
  editMode
}) => {
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    const fetchDatasetById = async (dataset, datasetId, file) => {
      const { error, data } = await DatasetService.findDatasetById(ORGANISATION_ID, datasetId);
      if (error) {
        console.error(error);
      }
      dataset.current = data;
      const fileName = UploadFileUtils.constructFileNameFromDataset(data, '');
      if (file.name !== fileName || file.status !== UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD) {
        setFile({ ...file, name: fileName, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
      }
    };

    if (datasetId) {
      fetchDatasetById(currentDataset, datasetId, file);
    } else {
      currentDataset.current = {};
      if (file.name !== '' || file.status !== UPLOAD_FILE_STATUS_KEY.EMPTY || file.file !== null) {
        setFile({ ...file, file: null, name: '', status: UPLOAD_FILE_STATUS_KEY.EMPTY });
      }
    }
  }, [currentDataset, datasetId, file, setFile]);

  return (
    <div>
      <UploadFile key="0"
        acceptedFileTypes={acceptedFileTypesToUpload}
        handleUploadFile={(event) => UploadFileUtils.handlePrepareToUpload(event, file, setFile)}
        handleDeleteFile={() => UploadFileUtils.handlePrepareToDeleteFile(file, setFile)}
        handleDownloadFile={() => UploadFileUtils.handleDownloadFile(currentDataset, file, setFile, scenarioId, workspaceId)}
        file={file}
        editMode={editMode}
      />
    </div>);
};

FileUpload.propTypes = {
  acceptedFileTypesToUpload: PropTypes.string,
  workspaceId: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  file: PropTypes.object.isRequired,
  setFile: PropTypes.func.isRequired,
  scenarioId: PropTypes.string.isRequired,
  currentDataset: PropTypes.object.isRequired,
  datasetId: PropTypes.string
};

export default FileUpload;
