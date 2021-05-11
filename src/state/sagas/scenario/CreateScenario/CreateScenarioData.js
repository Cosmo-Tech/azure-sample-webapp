// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANISATION_ID } from '../../../../configs/App.config';
import ScenarioService from '../../../../services/scenario/ScenarioService';
import { STATUSES } from '../../../commons/Constants';

// generators function
export function * createScenario (action) {
  // yield keyword is here to milestone and save the action
  const { error, data } = yield call(ScenarioService.createScenario, ORGANISATION_ID, action.workspaceId, action.scenario);
  if (error) {
    // TODO handle error management
  } else {
    // TODO Update scenarioList and getScenarioTree
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_CURRENT_SCENARIO action with list as payload
    yield put({ type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, data: { status: STATUSES.SUCCESS, scenario: data } });
  }
}

// generators function
// Here is a watcher that take EVERY action dispatched named GET_SCENARIO_LIST and bind getAllScenariosData saga to it
function * createScenarioData () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.CREATE_SCENARIO, createScenario);
}

export default createScenarioData;
