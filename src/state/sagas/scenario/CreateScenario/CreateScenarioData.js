// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import { getAllScenariosData } from '../FindAllScenarios/FindAllScenariosData';
import { ScenarioApi } from '../../../../services/ServiceCommons';

// generators function
export function * createScenario (action) {
  try { // yield keyword is here to milestone and save the action
    const workspaceId = action.workspaceId;
    const createdScenario = yield call([ScenarioApi, 'createScenario'], ORGANIZATION_ID, workspaceId, action.scenario);

    yield call(getAllScenariosData, workspaceId);
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_CURRENT_SCENARIO action with list as payload
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.IDLE, scenario: createdScenario }
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.ERROR }
    });
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named CREATE_SCENARIO and binds createScenario saga to it
function * createScenarioData () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.CREATE_SCENARIO, createScenario);
}

export default createScenarioData;
