// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import fileDownload from 'js-file-download';
import { Api } from '../../services/config/Api';

function uploadWorkspaceFile (organizationId, workspaceId, file, overwrite, destination) {
  return Api.Workspaces.uploadWorkspaceFile(
    organizationId,
    workspaceId,
    file,
    overwrite,
    destination);
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
  downloadWorkspaceFile
};

export default WorkspaceService;
