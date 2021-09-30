// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { UploadFile } from '@cosmotech/ui';
import { UploadFileUtils } from '../../UploadFileUtils';
import { useTranslation } from 'react-i18next';

const FileUpload = ({
  keyValue,
  acceptedFileTypesToUpload,
  datasetId,
  file,
  setFile,
  editMode
}) => {
  const { t } = useTranslation();

  const labels = {
    button: t('genericcomponent.uploadfile.button.browse'),
    invalidFileMessage: t('genericcomponent.uploadfile.tooltip.isvalidfile')
  };

  return (
    <div>
      <UploadFile key={keyValue}
        acceptedFileTypes={acceptedFileTypesToUpload}
        handleUploadFile={(event) => UploadFileUtils.prepareToUpload(event, file, setFile)}
        handleDeleteFile={() => UploadFileUtils.prepareToDeleteFile(file, setFile)}
        handleDownloadFile={(event) => {
          event.preventDefault();
          UploadFileUtils.downloadFile(datasetId, file, setFile);
        }}
        file={file}
        editMode={editMode}
        labels={labels}
      />
    </div>);
};

FileUpload.propTypes = {
  keyValue: PropTypes.string,
  acceptedFileTypesToUpload: PropTypes.string,
  editMode: PropTypes.bool.isRequired,
  file: PropTypes.object.isRequired,
  setFile: PropTypes.func.isRequired,
  datasetId: PropTypes.string
};

export default FileUpload;
