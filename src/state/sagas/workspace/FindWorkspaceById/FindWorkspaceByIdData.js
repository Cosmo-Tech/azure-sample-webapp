// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, select, takeEvery, put } from 'redux-saga/effects';
import { STATUSES } from '../../../commons/Constants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { ORGANIZATION_ID } from '../../../../config/GlobalConfiguration';
import { Api } from '../../../../services/config/Api';
import { SecurityUtils, WorkspacesUtils } from '../../../../utils';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getWorkspacesPermissionsMapping = (state) => state.application.permissionsMapping.workspace;

export function* fetchWorkspaceByIdData(workspaceId) {
  const userEmail = yield select(getUserEmail);
  const userId = yield select(getUserId);
  const workspacesPermissionsMapping = yield select(getWorkspacesPermissionsMapping);
  const { data } = yield call(Api.Workspaces.findWorkspaceById, ORGANIZATION_ID, workspaceId);
  data.users = SecurityUtils.getUsersIdsFromACL(data?.security?.accessControlList ?? []);
  WorkspacesUtils.patchWorkspaceWithCurrentUserPermissions(data, userEmail, userId, workspacesPermissionsMapping);

  yield put({
    type: WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE,
    status: STATUSES.SUCCESS,
    workspace: data,
  });
}

function* findWorkspaceByIdData() {
  yield takeEvery(WORKSPACE_ACTIONS_KEY.GET_WORKSPACE_BY_ID, fetchWorkspaceByIdData);
}

export default findWorkspaceByIdData;
