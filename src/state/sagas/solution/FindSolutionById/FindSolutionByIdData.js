// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';
import { SOLUTION_ACTIONS_KEY, SOLUTION_ENDPOINT } from '../../../commons/SolutionConstants';
import { STATUSES } from '../../../commons/Constants';

// generators function
export function * fetchSolutionByIdData (solutionId) {
  try {
    // yield keyword is here to milestone and save the action
    const { data } = yield axios.get(SOLUTION_ENDPOINT.FIND_SOLUTION_BY_ID, { params: { solutionId: solutionId } });
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_CURRENT_SOLUTION action with data as payload
    yield put({ type: SOLUTION_ACTIONS_KEY.SET_CURRENT_SOLUTION, data: { status: STATUSES.SUCCESS, solution: data } });
  } catch (error) {
    console.log(error);
  }
}

// generators function
// Here is a watcher that take EVERY action dispatched named FIND_SOLUTION_BY_ID and bind fetchSolutionByIdData saga to it
function * findSolutionByIdData () {
  yield takeEvery(SOLUTION_ACTIONS_KEY.GET_SOLUTION_BY_ID, fetchSolutionByIdData);
}

export default findSolutionByIdData;
