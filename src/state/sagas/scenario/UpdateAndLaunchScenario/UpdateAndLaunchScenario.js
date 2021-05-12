// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANISATION_ID } from '../../../../configs/App.config';
import ScenarioService from '../../../../services/scenario/ScenarioService';
// import { STATUSES } from '../../../commons/Constants';

// generators function
export function * updateAndLaunchScenario (action) {
  // yield keyword is here to milestone and save the action
  const workspaceId = action.workspaceId;
  const scenarioId = action.scenarioId;
  const scenarioParameters = action.scenarioParameters;
  const { error, data } = yield call(ScenarioService.updateAndLaunchScenario, ORGANISATION_ID, workspaceId, scenarioId, scenarioParameters);
  if (error) {
    // TODO handle error management
    console.log(error);
  } else {
    console.log(data);
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_CURRENT_SCENARIO action with list as payload
    // TODO store data in new state
    // yield put({ type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO, data: { status: STATUSES.SUCCESS, scenario: data } });
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named CREATE_SCENARIO and binds createScenario saga to it
function * updateAndLaunchScenarioSaga () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.UPDATE_AND_LAUNCH_SCENARIO, updateAndLaunchScenario);
}

export default updateAndLaunchScenarioSaga;
