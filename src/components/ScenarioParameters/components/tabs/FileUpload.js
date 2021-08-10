// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UploadFile } from '@cosmotech/ui';
import { UploadFileUtils } from '../../UploadFileUtils';
import { Button, Grid, makeStyles } from '@material-ui/core';
import PreviewUploadFile from '../PreviewUploadFile';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    height: '200px',
    width: '100%'
  }
}));

const FileUpload = ({
  keyValue,
  acceptedFileTypesToUpload,
  datasetId,
  file,
  setFile,
  editMode
}) => {
  const classes = useStyles();

  // null button, false loading, true loaded
  const [showPreview, setShowPreview] = useState(null);

  const handleDownloadFile = (event) => {
    event.preventDefault();
    UploadFileUtils.downloadFile(datasetId, file, setFile);
  };

  const setPreviewFile = (event) => {
    event.preventDefault();
    setShowPreview(false);
    UploadFileUtils.setPreviewFile(datasetId, file, setFile, setShowPreview);
  };

  return (
    <Grid container direction="row" className={classes.gridContainer}>
      <Grid item xs={4}>
        <UploadFile
          key={keyValue}
          acceptedFileTypes={acceptedFileTypesToUpload}
          handleUploadFile={(event) =>
            UploadFileUtils.prepareToUpload(event, file, setFile, setShowPreview)
          }
          handleDeleteFile={() =>
            UploadFileUtils.prepareToDeleteFile(file, setFile, setShowPreview)
          }
          handleDownloadFile={handleDownloadFile}
          file={file}
          editMode={editMode}
        />
      </Grid>
      <Grid item xs={8}>
        { showPreview === null
          ? <Button onClick={setPreviewFile}>
            Show Preview
          </Button>
          : <PreviewUploadFile
            isLoading={!showPreview}
            file={file}
            showPreview={showPreview}
            setShowPreview={setShowPreview}/>
        }
      </Grid>
    </Grid>);
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
