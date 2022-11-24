// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { Api } from '../../../../services/config/Api';
import { STATUSES } from '../../../commons/Constants';

export function* getAllWorkspaces(organizationId) {
  const { data } = yield call(Api.Workspaces.findAllWorkspaces, organizationId);
  yield put({
    type: WORKSPACE_ACTIONS_KEY.SET_ALL_WORKSPACES,
    list: data,
    status: STATUSES.SUCCESS,
  });
}

function* watchGetAllWorkspaces() {
  yield takeEvery(WORKSPACE_ACTIONS_KEY.GET_ALL_WORKSPACES, getAllWorkspaces);
}

export default watchGetAllWorkspaces;
