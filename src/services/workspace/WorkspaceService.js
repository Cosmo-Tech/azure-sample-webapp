// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { WorkspaceApi } from '../ServiceCommons';

async function findWorkspaceById (organizationId, workspaceId) {
  const workspace = await WorkspaceApi.findWorkspaceById(organizationId, workspaceId);
  return workspace;
}

async function uploadWorkspaceFile (organizationId, workspaceId, file, overwrite, destination) {
  const workspace = await WorkspaceApi.uploadWorkspaceFile(organizationId, workspaceId, file, { overwrite: overwrite, destination: destination });
  return workspace;
}

async function deleteWorkspaceFile (organizationId, workspaceId, fileName) {
  const workspace = await WorkspaceApi.deleteWorkspaceFile(organizationId, workspaceId, fileName);
  return workspace;
}

async function getAllWorkspaceFileName (organizationId, workspaceId) {
  const workspaces = await WorkspaceApi.getAllWorkspaceFile(organizationId, workspaceId);
  return workspaces;
}

// FIXME: this method does not work correctly for the moment
// This is apparently due to a parameter (responseType) in the WorkspaceAPI call.
// For the moment, please use the method "fetchWorkspaceFile" instead.
// eslint-disable-next-line no-unused-vars
async function downloadWorkspaceFile (organizationId, workspaceId, fileName) {
  const file = await WorkspaceApi.downloadWorkspaceFile(organizationId, workspaceId, fileName);
  return file;
}

const WorkspaceService = {
  findWorkspaceById,
  uploadWorkspaceFile,
  deleteWorkspaceFile,
  getAllWorkspaceFileName
};

export default WorkspaceService;
