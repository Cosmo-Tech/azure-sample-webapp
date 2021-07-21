// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { WorkspaceApi } from '../ServiceCommons';

async function uploadWorkspaceFile (organizationId, workspaceId, file, overwrite, destination) {
  const workspace = await WorkspaceApi.uploadWorkspaceFile(organizationId, workspaceId, file, { overwrite: overwrite, destination: destination });
  return workspace;
}

const WorkspaceService = {
  uploadWorkspaceFile
};

export default WorkspaceService;
