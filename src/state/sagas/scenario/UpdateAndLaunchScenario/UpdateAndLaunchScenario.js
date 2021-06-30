// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_RUN_STATE } from '../../../../utils/ApiUtils';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import ScenarioService from '../../../../services/scenario/ScenarioService';
import ScenarioRunService from '../../../../services/scenarioRun/ScenarioRunService';

// generators function
export function * updateAndLaunchScenario (action) {
  const workspaceId = action.workspaceId;
  const scenarioId = action.scenarioId;
  const scenarioParameters = action.scenarioParameters;
  // Update scenario parameters
  yield put({
    type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
    data: {
      status: STATUSES.SAVING,
      scenario: { state: SCENARIO_RUN_STATE.RUNNING }
    }
  });
  const { error: updateError, data: updateData } = yield call(
    ScenarioService.updateScenarioParameters, ORGANIZATION_ID, workspaceId,
    scenarioId, scenarioParameters);
  if (updateError) {
    console.error('Failed to update scenario parameters');
    console.error(updateError);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.ERROR }
    });
  } else {
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: {
        status: STATUSES.IDLE,
        scenario: { state: SCENARIO_RUN_STATE.RUNNING, parametersValues: updateData }
      }
    });
    // Launch scenario if parameters update succeeded
    const { error: runError } = yield call(
      ScenarioRunService.runScenario, ORGANIZATION_ID, workspaceId, scenarioId);
    if (runError) {
      console.error(runError);
    } else {
      // Start backend polling to update the scenario status
      yield put({
        type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
        workspaceId: workspaceId,
        scenarioId: scenarioId
      });
    }
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
