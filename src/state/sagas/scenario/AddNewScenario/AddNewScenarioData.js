// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { SCENARIO_ENDPOINT, SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';

// generators function
export function * fetchAddScenarioData (action) {
  yield put({ type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, data: { status: STATUSES.SAVING, scenario: null } });
  const { data } = yield axios.get(SCENARIO_ENDPOINT.ADD_NEW_SCENARIO, { params: { scenario: action.data } });
  yield put({ type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, data: { status: STATUSES.SUCCESS, scenario: data } });
}

// generators function
function * addNewScenarioData () {
  yield takeLatest(SCENARIO_ACTIONS_KEY.ADD_NEW_SCENARIO, fetchAddScenarioData);
}

export default addNewScenarioData;
