// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';
import { STATUSES } from '../../../commons/Constants';
import { WORKSPACE_ACTIONS_KEY, WORKSPACE_ENDPOINT } from '../../../commons/WorkspaceConstants';

// generators function
export function * fetchWorkspaceByIdData (workspaceId) {
  // yield keyword is here to milestone and save the action
  const { data } = yield axios.get(WORKSPACE_ENDPOINT.FIND_WORKSPACE_BY_ID, { params: { workspaceId: workspaceId } });
  yield put({ type: WORKSPACE_ACTIONS_KEY.SET_CURRENT_WORKSPACE, data: { status: STATUSES.SUCCESS, workspace: data } });
}

// generators function
// Here is a watcher that take EVERY action dispatched named GET_SCENARIO_LIST and bind getAllScenariosData saga to it
function * findWorkspaceByIdData () {
  yield takeEvery(WORKSPACE_ACTIONS_KEY.GET_WORKSPACE_BY_ID, fetchWorkspaceByIdData);
}

export default findWorkspaceByIdData;
