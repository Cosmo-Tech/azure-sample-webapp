// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { SOLUTION_ACTIONS_KEY } from '../../../commons/SolutionConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import { SolutionApi } from '../../../../configs/Api.config';

// generators function
export function * fetchSolutionByIdData (workspaceId, solutionId) {
  try { // yield keyword is here to milestone and save the action
    const solution = yield call([SolutionApi, 'findSolutionById'], ORGANIZATION_ID, solutionId);
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_CURRENT_SOLUTION action with data as payload
    yield put({ type: SOLUTION_ACTIONS_KEY.SET_CURRENT_SOLUTION, data: { status: STATUSES.SUCCESS, solution: solution } });
  } catch (e) {
    console.error(e);
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_SOLUTION_BY_ID and binds fetchSolutionByIdData saga to it
function * findSolutionByIdData () {
  yield takeEvery(SOLUTION_ACTIONS_KEY.GET_SOLUTION_BY_ID, fetchSolutionByIdData);
}

export default findSolutionByIdData;
