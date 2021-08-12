// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { UploadFile } from '@cosmotech/ui';
import { UploadFileUtils } from '../../UploadFileUtils';
import { Grid, makeStyles } from '@material-ui/core';
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

  const handleDownloadFile = (event) => {
    event.preventDefault();
    UploadFileUtils.downloadFile(datasetId, file, setFile);
  };

  return (
    <Grid container direction="row" className={classes.gridContainer}>
      <Grid item xs={5}>
        <UploadFile
          key={keyValue}
          acceptedFileTypes={acceptedFileTypesToUpload}
          handleUploadFile={(event) =>
            UploadFileUtils.prepareToUpload(event, file, setFile)
          }
          handleDeleteFile={() =>
            UploadFileUtils.prepareToDeleteFile(file, setFile)
          }
          handleDownloadFile={handleDownloadFile}
          file={file}
          editMode={editMode}
        />
      </Grid>
      <Grid item xs={7}>
          <PreviewUploadFile
            setFile={setFile}
            file={file}
            datasetId={datasetId}/>
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
