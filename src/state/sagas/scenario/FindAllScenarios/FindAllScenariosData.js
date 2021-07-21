// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import { ScenarioApi } from '../../../../services/ServiceCommons';

// generators function
export function * getAllScenariosData (workspaceId) {
  try { // yield keyword is here to milestone and save the action
    const scenarioList = yield call([ScenarioApi, 'findAllScenarios'], ORGANIZATION_ID, workspaceId);
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_ALL_SCENARIOS action with list as payload
    yield put({ type: SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS, list: scenarioList });
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
