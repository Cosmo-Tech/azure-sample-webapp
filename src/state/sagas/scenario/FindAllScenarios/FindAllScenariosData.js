// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANIZATION_ID } from '../../../../config/AppInstance';
import { Api } from '../../../../services/config/Api';
import { STATUSES } from '../../../commons/Constants';

// generators function
export function * getAllScenariosData (workspaceId) {
  try {
    // yield keyword is here to milestone and save the action
    const { data } = yield call(Api.Scenarios.findAllScenarios, ORGANIZATION_ID, workspaceId);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS,
      list: data,
      status: STATUSES.SUCCESS
    });
  } catch (e) {
    console.error(e);
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_ALL_SCENARIOS and binds getAllScenariosData saga to it
function * findAllScenariosData () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS, getAllScenariosData);
}

export default findAllScenariosData;
