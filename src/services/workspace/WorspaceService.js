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

const WorkspaceService = {
  findWorkspaceById
};

export default WorkspaceService;
