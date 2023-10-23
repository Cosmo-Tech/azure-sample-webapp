// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ArrayDictUtils } from './ArrayDictUtils';
import { SecurityUtils } from './SecurityUtils';
import { TranslationUtils } from './TranslationUtils';
import { WORKSPACES } from '../config/overrides/Workspaces.js';

const _getUserPermissionsForWorkspace = (workspace, userEmail, userId, permissionsMapping) => {
  if (workspace?.security == null || Object.keys(workspace?.security).length === 0) {
    console.warn(`No security data for workspace ${workspace?.id}, restricting access to its content`);
    return [];
  }
  return SecurityUtils.getUserPermissionsForResource(workspace.security, userEmail, permissionsMapping);
};

const patchWorkspaceWithCurrentUserPermissions = (workspace, userEmail, userId, permissionsMapping) => {
  // workspace.security seems to be read-only, we have to create a new object to add a "currentUserPermissions" key
  workspace.security = {
    ...workspace.security,
    currentUserPermissions: _getUserPermissionsForWorkspace(workspace, userEmail, userId, permissionsMapping),
  };
};

const patchWorkspacesIfLocalConfigExists = async (originalWorkspaces) => {
  ArrayDictUtils.mergeArraysByElementsIds(originalWorkspaces, WORKSPACES);
};

const addTranslationLabels = (workspace) => {
  try {
    TranslationUtils.addTranslationOfDatasetManagerLabels(workspace?.webApp?.options?.datasetManager ?? {});
  } catch (error) {
    console.warn(`An error occurred when loading labels from workspace "${workspace.name}" (id "${workspace.id}")`);
    console.error(error);
  }
};

export const WorkspacesUtils = {
  addTranslationLabels,
  patchWorkspacesIfLocalConfigExists,
  patchWorkspaceWithCurrentUserPermissions,
};
