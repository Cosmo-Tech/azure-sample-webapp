// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { UploadFile } from '@cosmotech/ui';

const FileUpload = ({
  acceptedFileTypesToUpload,
  handleUploadFile,
  handleDeleteFile,
  handleDownloadFile,
  fileToDownload,
  fileCache,
  fileStatus,
  editMode
}) => {
  return (
    <div>
      <UploadFile key="0"
        acceptedFileTypes={acceptedFileTypesToUpload}
        handleUploadFile={handleUploadFile}
        handleDeleteFile={handleDeleteFile}
        handleDownloadFile={handleDownloadFile}
        fileToDownload={fileToDownload}
        fileCache={fileCache}
        fileStatus={fileStatus}
        editMode={editMode}
      />
    </div>);
};

FileUpload.propTypes = {
  acceptedFileTypesToUpload: PropTypes.string,
  handleUploadFile: PropTypes.func.isRequired,
  handleDeleteFile: PropTypes.func.isRequired,
  handleDownloadFile: PropTypes.func.isRequired,
  fileToDownload: PropTypes.object,
  fileCache: PropTypes.object,
  fileStatus: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default FileUpload;
