// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { CosmotechApiService } from '../../configs/Api.config';

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
  getAllWorkspaceFileName
};

export default WorkspaceService;
