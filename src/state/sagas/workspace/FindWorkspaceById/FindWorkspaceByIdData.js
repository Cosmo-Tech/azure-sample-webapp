// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { STATUSES } from '../../../commons/Constants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import { WorkspaceApi } from '../../../../services/ServiceCommons';

// generators function
export function * fetchWorkspaceByIdData (workspaceId) {
  try { // yield keyword is here to milestone and save the action
    const workspace = yield call([WorkspaceApi, 'findWorkspaceById'], ORGANIZATION_ID, workspaceId);
    yield put({
      type: WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE,
      data: { status: STATUSES.SUCCESS, workspace: workspace }
    });
  } catch (e) {
    console.error(e);
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_WORKSPACE_BY_ID and binds fetchWorkspaceByIdData saga to it
function * findWorkspaceByIdData () {
  yield takeEvery(WORKSPACE_ACTIONS_KEY.GET_WORKSPACE_BY_ID, fetchWorkspaceByIdData);
}

export default findWorkspaceByIdData;
