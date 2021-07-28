// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { STATUSES } from '../../../commons/Constants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import { Api } from '../../../../configs/Api.config';

// generators function
export function * fetchWorkspaceByIdData (workspaceId) {
  try { // yield keyword is here to milestone and save the action
    const { data } = yield call(Api.Workspaces.findWorkspaceById, ORGANIZATION_ID, workspaceId);
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_CURRENT_WORKSPACE action with data as payload
    yield put({ type: WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE, data: { status: STATUSES.SUCCESS, workspace: data } });
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
