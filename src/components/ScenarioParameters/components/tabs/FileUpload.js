// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { UploadFile, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { UploadFileUtils } from '../../UploadFileUtils';
import DatasetService from '../../../../services/dataset/DatasetService';
import { ORGANISATION_ID } from '../../../../configs/App.config';

const FileUpload = ({
  acceptedFileTypesToUpload,
  currentDataset,
  datasetId,
  workspaceId,
  parameterId,
  file,
  setFile,
  scenarioId,
  editMode
}) => {
  useEffect(() => {
    const fetchDatasetById = async (dataset, datasetId) => {
      const { error, data } = await DatasetService.findDatasetById(ORGANISATION_ID, datasetId);
      if (error) {
        throw new Error('Dataset does not exist for this organisation');
      }
      return data;
    };
    if (datasetId !== undefined &&
        (file.status === UPLOAD_FILE_STATUS_KEY.EMPTY ||
        file.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD)) {
      fetchDatasetById(currentDataset, datasetId)
        .then((data) => {
          currentDataset.current = data;
          const fileName = UploadFileUtils.constructFileNameFromDataset(currentDataset.current, '');
          setFile({ ...file, name: fileName, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
        })
        .catch((error) => {
          console.error(error);
          currentDataset.current = {};
          setFile({ ...file, name: '', status: UPLOAD_FILE_STATUS_KEY.EMPTY });
        });
    } else if (datasetId === undefined &&
        file.status !== UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
      currentDataset.current = {};
      setFile({ ...file, file: null, name: '', status: UPLOAD_FILE_STATUS_KEY.EMPTY });
    }
    // eslint-disable-next-line
  }, [currentDataset, datasetId, file.name, setFile]);

  return (
    <div>
      <UploadFile key="0"
        acceptedFileTypes={acceptedFileTypesToUpload}
        handleUploadFile={(event) => UploadFileUtils.handlePrepareToUpload(event, file, setFile)}
        handleDeleteFile={() => UploadFileUtils.handlePrepareToDeleteFile(file, setFile)}
        handleDownloadFile={() => UploadFileUtils.handleDownloadFile(currentDataset, file, setFile, scenarioId, parameterId, workspaceId)}
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
  parameterId: PropTypes.string.isRequired,
  currentDataset: PropTypes.object.isRequired,
  datasetId: PropTypes.string
};

export default FileUpload;
