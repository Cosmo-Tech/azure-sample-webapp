// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { UploadFile, UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import { UploadFileUtils } from '../../UploadFileUtils';

const FileUpload = ({
  acceptedFileTypesToUpload,
  currentDataset,
  datasetId,
  file,
  setFile,
  editMode,
  downloadFile,
  fetchDataset
}) => {
  useEffect(() => {
    if (datasetId !== '' &&
        (file.status === UPLOAD_FILE_STATUS_KEY.EMPTY ||
        file.status === UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD)) {
      fetchDataset()
        .then((data) => {
          currentDataset.current = data;
          const fileName = UploadFileUtils.buildFileNameFromDataset(currentDataset.current, '');
          setFile({ ...file, initialName: fileName, name: fileName, status: UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD });
        })
        .catch((error) => {
          console.error(error);
          currentDataset.current = {};
          setFile({ ...file, name: '', status: UPLOAD_FILE_STATUS_KEY.EMPTY });
        });
    } else if (datasetId === '' &&
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
        handleUploadFile={(event) => UploadFileUtils.prepareToUpload(event, file, setFile)}
        handleDeleteFile={() => UploadFileUtils.prepareToDeleteFile(file, setFile)}
        handleDownloadFile={(event) => {
          event.preventDefault();
          downloadFile();
        }}
        file={file}
        editMode={editMode}
      />
    </div>);
};

FileUpload.propTypes = {
  acceptedFileTypesToUpload: PropTypes.string,
  editMode: PropTypes.bool.isRequired,
  file: PropTypes.object.isRequired,
  setFile: PropTypes.func.isRequired,
  currentDataset: PropTypes.object.isRequired,
  datasetId: PropTypes.string,
  downloadFile: PropTypes.func.isRequired,
  fetchDataset: PropTypes.func.isRequired
};

export default FileUpload;
