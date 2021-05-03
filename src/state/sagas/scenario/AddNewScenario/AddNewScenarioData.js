// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { SCENARIO_ENDPOINT, SCENARIO_ACTIONS_KEY, SCENARIO_STATUS } from '../../../commons/ScenarioConstants';

// generators function
export function * fetchAddScenarioData (action) {
  yield put({ type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, data: { status: SCENARIO_STATUS.SAVING, scenario: null } });
  const { data } = yield axios.get(SCENARIO_ENDPOINT.ADD_NEW_SCENARIO, { params: { scenario: action.data } });
  yield put({ type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, data: { status: SCENARIO_STATUS.SAVED, scenario: data } });
}

// generators function
function * addNewScenarioData () {
  yield takeLatest(SCENARIO_ACTIONS_KEY.ADD_NEW_SCENARIO, fetchAddScenarioData);
}

export default addNewScenarioData;
