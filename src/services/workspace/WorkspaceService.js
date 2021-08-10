// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import fileDownload from 'js-file-download';
import { Api } from '../../configs/Api.config';

function uploadWorkspaceFile (organizationId, workspaceId, file, overwrite, destination) {
  return Api.Workspaces.uploadWorkspaceFile(
    organizationId,
    workspaceId,
    file,
    overwrite,
    destination);
}

async function previewWorkspaceFile (organizationId, workspaceId, fileName) {
  const { data, status } = await Api.Workspaces.downloadWorkspaceFile(organizationId, workspaceId, fileName, { responseType: 'blob' });
  if (status !== 200) {
    throw new Error(`Error when fetching ${fileName}`);
  }
  return new File([data], fileName, { size: data.size, type: data.type });
}

async function downloadWorkspaceFile (organizationId, workspaceId, fileName) {
  const { data, status } = await Api.Workspaces.downloadWorkspaceFile(
    organizationId, workspaceId, fileName, { responseType: 'blob' });
  if (status !== 200) {
    throw new Error(`Error when fetching ${fileName}`);
  }
  fileDownload(data, fileName.split('/').pop());
}

const WorkspaceService = {
  uploadWorkspaceFile,
  previewWorkspaceFile,
  downloadWorkspaceFile
};

export default WorkspaceService;
