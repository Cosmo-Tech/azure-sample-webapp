// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { SOLUTION_ACTIONS_KEY } from '../../../commons/SolutionConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../config/AppInstance';
import { Api } from '../../../../services/config/Api';

export function * fetchSolutionByIdData (workspaceId, solutionId) {
  try {
    const { data } = yield call(Api.Solutions.findSolutionById, ORGANIZATION_ID, solutionId);
    yield put({
      type: SOLUTION_ACTIONS_KEY.SET_CURRENT_SOLUTION,
      status: STATUSES.SUCCESS,
      solution: data
    });
  } catch (e) {
    console.error(e);
  }
}

function * findSolutionByIdData () {
  yield takeEvery(SOLUTION_ACTIONS_KEY.GET_SOLUTION_BY_ID, fetchSolutionByIdData);
}

export default findSolutionByIdData;
