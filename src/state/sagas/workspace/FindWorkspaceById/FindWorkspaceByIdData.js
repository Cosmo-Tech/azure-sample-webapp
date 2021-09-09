// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { STATUSES } from '../../../commons/Constants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { ORGANIZATION_ID } from '../../../../config/AppInstance';
import { Api } from '../../../../services/config/Api';

export function * fetchWorkspaceByIdData (workspaceId) {
  try {
    const { data } = yield call(Api.Workspaces.findWorkspaceById, ORGANIZATION_ID, workspaceId);
    yield put({
      type: WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE,
      status: STATUSES.SUCCESS,
      workspace: data
    });
  } catch (e) {
    console.error(e);
  }
}

function * findWorkspaceByIdData () {
  yield takeEvery(WORKSPACE_ACTIONS_KEY.GET_WORKSPACE_BY_ID, fetchWorkspaceByIdData);
}

export default findWorkspaceByIdData;
