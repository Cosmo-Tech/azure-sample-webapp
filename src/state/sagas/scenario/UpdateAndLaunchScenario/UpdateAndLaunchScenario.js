// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANISATION_ID } from '../../../../configs/App.config';
import ScenarioService from '../../../../services/scenario/ScenarioService';
import { STATUSES } from '../../../commons/Constants';

// generators function
export function * updateAndLaunchScenario (action) {
  const workspaceId = action.workspaceId;
  const scenarioId = action.scenarioId;
  const scenarioParameters = action.scenarioParameters;
  // Update scenario parameters
  const { error, data } = yield call(ScenarioService.updateScenarioParameters,
    ORGANISATION_ID, workspaceId, scenarioId, scenarioParameters);
  if (error) {
    console.error('Failed to update scenario parameters');
    console.error(error);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.IDLE }
    });
  } else {
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.SUCCESS, scenario: { parametersValues: data } }
    });
    // TODO: launch scenario
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named CREATE_SCENARIO
// and binds createScenario saga to it
function * updateAndLaunchScenarioSaga () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.UPDATE_AND_LAUNCH_SCENARIO,
    updateAndLaunchScenario);
}

export default updateAndLaunchScenarioSaga;
