// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { FileBlobUtils } from '@cosmotech/core';
import { Api } from '../../services/config/Api';

function uploadWorkspaceFile(organizationId, workspaceId, file, overwrite, destination) {
  return Api.Workspaces.uploadWorkspaceFile(organizationId, workspaceId, file, overwrite, destination);
}

function uploadWorkspaceFileFromData(organizationId, workspaceId, data, type = 'text/csv', overwrite, destination) {
  const blob = new Blob([data], { type });
  return Api.Workspaces.uploadWorkspaceFile(organizationId, workspaceId, blob, overwrite, destination);
}

async function downloadWorkspaceFile(organizationId, workspaceId, fileName) {
  const { data, status } = await Api.Workspaces.downloadWorkspaceFile(organizationId, workspaceId, fileName, {
    responseType: 'blob',
  });
  if (status !== 200) {
    throw new Error(`Error when fetching ${fileName}`);
  }
  FileBlobUtils.downloadFileFromData(data, fileName.split('/').pop());
}

async function downloadWorkspaceFileData(organizationId, workspaceId, fileName) {
  const { data, status } = await Api.Workspaces.downloadWorkspaceFile(organizationId, workspaceId, fileName, {
    responseType: 'blob',
  });
  if (status !== 200) {
    throw new Error(`Error when fetching ${fileName}`);
  }
  return FileBlobUtils.readFileBlobAsync(data);
}

const WorkspaceService = {
  uploadWorkspaceFile,
  uploadWorkspaceFileFromData,
  downloadWorkspaceFile,
  downloadWorkspaceFileData,
};

export default WorkspaceService;
