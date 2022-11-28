// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, select, takeEvery } from 'redux-saga/effects';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { Api } from '../../../../services/config/Api';
import { STATUSES } from '../../../commons/Constants';
import { SecurityUtils, WorkspacesUtils } from '../../../../utils';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl/Permissions';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getWorkspacesPermissionsMapping = (state) => state.application.permissionsMapping.workspace;

const keepOnlyReadableWorkspaces = (workspaces) =>
  workspaces.filter((workspace) => workspace.security.currentUserPermissions.includes(ACL_PERMISSIONS.SCENARIO.READ));

export function* getAllWorkspaces(organizationId) {
  const userEmail = yield select(getUserEmail);
  const userId = yield select(getUserId);
  const workspacesPermissionsMapping = yield select(getWorkspacesPermissionsMapping);

  const { data } = yield call(Api.Workspaces.findAllWorkspaces, organizationId);
  data.forEach((workspace) => {
    workspace.users = SecurityUtils.getUsersIdsFromACL(workspace?.security?.accessControlList ?? []);
    WorkspacesUtils.patchWorkspaceWithCurrentUserPermissions(
      workspace,
      userEmail,
      userId,
      workspacesPermissionsMapping
    );
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
