// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import ScenarioService from '../../../../services/scenario/ScenarioService';
import { ORGANISATION_ID } from '../../../../configs/App.config';

// generators function
export function * getAllScenariosData (workspaceId) {
  // yield keyword is here to milestone and save the action
  const { error, data } = yield call(ScenarioService.findAllScenarios, ORGANISATION_ID, workspaceId);
  if (error) {
    // TODO handle error management
  } else {
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_ALL_SCENARIOS action with list as payload
    yield put({ type: SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS, list: data });
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_ALL_SCENARIOS and binds getAllScenariosData saga to it
function * findAllScenariosData () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS, getAllScenariosData);
}

export default findAllScenariosData;
