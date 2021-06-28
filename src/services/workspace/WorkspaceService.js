// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { CosmotechApiService, getDefaultBasePath } from '../../configs/Api.config';
import fileDownload from 'js-file-download';
import { getAccessToken } from '../../utils/StorageUtils';

const WorkspaceApi = new CosmotechApiService.WorkspaceApi();

function findWorkspaceById (organizationId, workspaceId) {
  return new Promise((resolve) => {
    WorkspaceApi.findWorkspaceById(organizationId, workspaceId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function uploadWorkspaceFile (organizationId, workspaceId, file, overwrite, destination) {
  return new Promise((resolve) => {
    WorkspaceApi.uploadWorkspaceFile(organizationId, workspaceId, file, { overwrite: overwrite, destination: destination }, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function deleteWorkspaceFile (organizationId, workspaceId, fileName) {
  return new Promise((resolve) => {
    WorkspaceApi.deleteWorkspaceFile(organizationId, workspaceId, fileName, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

function getAllWorkspaceFileName (organizationId, workspaceId) {
  return new Promise((resolve) => {
    WorkspaceApi.getAllWorkspaceFile(organizationId, workspaceId, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

async function fetchWorkspaceFile (organizationId, workspaceId, filePath) {
  const accessToken = getAccessToken();

  const fetchParams = {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`
    })
  };

  fetch(getDefaultBasePath() + '/organizations/' + organizationId + '/workspaces/' + workspaceId + '/files/download?file_name=' + filePath,
    fetchParams
  )
    .then(response => {
      if (response.status !== 200) {
        throw new Error(`Error when fetching ${filePath}`);
      }
      return response.blob();
    })
    .then(blob => {
      fileDownload(blob, filePath.split('/').pop());
    })
    .catch((error) => console.error(error));
}

// FIXME: this method does not work correctly for the moment
// This is apparently due to a parameter (responseType) in the WorkspaceAPI call.
// For the moment, please use the method "fetchWorkspaceFile" instead.
// eslint-disable-next-line no-unused-vars
function downloadWorkspaceFile (organizationId, workspaceId, fileName) {
  return new Promise((resolve) => {
    WorkspaceApi.downloadWorkspaceFile(organizationId, workspaceId, fileName, (error, data, response) => {
      resolve({ error, data, response });
    });
  });
}

const WorkspaceService = {
  findWorkspaceById,
  uploadWorkspaceFile,
  deleteWorkspaceFile,
  getAllWorkspaceFileName,
  fetchWorkspaceFile
};

export default WorkspaceService;
