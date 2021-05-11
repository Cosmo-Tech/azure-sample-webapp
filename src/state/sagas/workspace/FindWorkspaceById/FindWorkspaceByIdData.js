// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { STATUSES } from '../../../commons/Constants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { ORGANISATION_ID } from '../../../../configs/App.config';
import WorkspaceService from '../../../../services/workspace/WorspaceService';

// generators function
export function * fetchWorkspaceByIdData (workspaceId) {
  // yield keyword is here to milestone and save the action
  const { error, data } = yield call(WorkspaceService.findWorkspaceById, ORGANISATION_ID, workspaceId);
  if (error) {
    // TODO handle error management
  } else {
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_CURRENT_WORKSPACE action with data as payload
    yield put({ type: WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE, data: { status: STATUSES.SUCCESS, workspace: data } });
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_WORKSPACE_BY_ID and binds fetchWorkspaceByIdData saga to it
function * findWorkspaceByIdData () {
  yield takeEvery(WORKSPACE_ACTIONS_KEY.GET_WORKSPACE_BY_ID, fetchWorkspaceByIdData);
}

export default findWorkspaceByIdData;
