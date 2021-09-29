// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import ScenarioService from '../../../../services/scenario/ScenarioService';
import { UploadFile, SelfDestructLinkButton } from '@cosmotech/ui';
import { UploadFileUtils } from '../../UploadFileUtils';

const DATASET_DOWNLOAD_POLLING_DELAY = 10 * 1000;
const DATASET_DOWNLOAD_TIMEOUT_DURATION = 15 * 60;

const useStyles = makeStyles(theme => ({
  datasetDownloadButton: {
    marginBottom: '15px'
  }
}));

const FileUpload = ({
  workspaceId,
  scenario,
  keyValue,
  acceptedFileTypesToUpload,
  datasetId,
  file,
  setFile,
  editMode
}) => {
  const classes = useStyles();
  const timeoutId = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutId.current);
  }, []);

  const timeout = (ms) => {
    return new Promise(resolve => { timeoutId.current = setTimeout(resolve, ms); });
  };

  const startPolling = async (sdlId) => {
    let jobInfo;
    let state;
    jobInfo = await ScenarioService.getScenarioDataDownloadJobInfo(workspaceId, scenario.id, sdlId);
    state = jobInfo?.state;
    while (state === 'Running' || state === 'Unknown') {
      await timeout(DATASET_DOWNLOAD_POLLING_DELAY);
      jobInfo = await ScenarioService.getScenarioDataDownloadJobInfo(workspaceId, scenario.id, sdlId);
      state = jobInfo.state;
    }
    if (state === 'Successful') {
      return jobInfo.url;
    }
    console.error('Error during generation of dataset download link');
    return '';
  };

  const generate = async () => {
    const sdlId = await ScenarioService.downloadScenarioData(workspaceId, scenario.id);
    return await startPolling(sdlId);
  };

  const isRootScenario = scenario.parentId === null;

  return (
    <div>
      { isRootScenario && (
        <div className={classes.datasetDownloadButton}>
          <SelfDestructLinkButton
            generate={generate}
            labels={ { download: 'Download', generateLink: 'Generate link' } }
            timeout={DATASET_DOWNLOAD_TIMEOUT_DURATION}
          />
        </div>
      )
      }
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
      />
    </div>);
};

FileUpload.propTypes = {
  workspaceId: PropTypes.string.isRequired,
  scenario: PropTypes.object.isRequired,
  keyValue: PropTypes.string,
  acceptedFileTypesToUpload: PropTypes.string,
  editMode: PropTypes.bool.isRequired,
  file: PropTypes.object.isRequired,
  setFile: PropTypes.func.isRequired,
  datasetId: PropTypes.string
};

export default FileUpload;
