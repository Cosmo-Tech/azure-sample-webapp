// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { call, put, select, takeEvery } from 'redux-saga/effects';
import ConfigService from '../../../../services/ConfigService';
import { Api } from '../../../../services/config/Api';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl/Permissions';
import { SecurityUtils, WorkspacesUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';

const WORKSPACES_IDS_FILTER = ConfigService.getParameterValue('WORKSPACES_IDS_FILTER');

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getWorkspacesPermissionsMapping = (state) => state.application.permissionsMapping.workspace;

const keepOnlyReadableWorkspaces = (workspaces) => {
  if (WORKSPACES_IDS_FILTER) {
    return workspaces.filter(
      (workspace) =>
        workspace.security.currentUserPermissions.includes(ACL_PERMISSIONS.SCENARIO.READ) &&
        WORKSPACES_IDS_FILTER.includes(workspace.id)
    );
  }
  return workspaces.filter((workspace) =>
    workspace.security.currentUserPermissions.includes(ACL_PERMISSIONS.SCENARIO.READ)
  );
};

export function* getAllWorkspaces(organizationId) {
  const userEmail = yield select(getUserEmail);
  const userId = yield select(getUserId);
  const workspacesPermissionsMapping = yield select(getWorkspacesPermissionsMapping);

  const { data } = yield call(Api.Workspaces.findAllWorkspaces, organizationId);
  WorkspacesUtils.patchWorkspacesIfLocalConfigExists(data);
  data.forEach((workspace) => {
    workspace.users = SecurityUtils.getUsersIdsFromACL(workspace?.security?.accessControlList ?? []);
    WorkspacesUtils.patchWorkspaceWithCurrentUserPermissions(
      workspace,
      userEmail,
      userId,
      workspacesPermissionsMapping
    );
    WorkspacesUtils.patchWorkspaceWithDatasetManagerConfiguration(workspace);
    WorkspacesUtils.addTranslationLabels(workspace);
  });

  yield put({
    type: WORKSPACE_ACTIONS_KEY.SET_ALL_WORKSPACES,
    list: keepOnlyReadableWorkspaces(data),
    status: STATUSES.SUCCESS,
  });
}

function* watchGetAllWorkspaces() {
  yield takeEvery(WORKSPACE_ACTIONS_KEY.GET_ALL_WORKSPACES, getAllWorkspaces);
}

export default watchGetAllWorkspaces;
