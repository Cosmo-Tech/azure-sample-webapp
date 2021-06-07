// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_RUN_STATE } from '../../../../utils/ApiUtils';
import { ORGANISATION_ID } from '../../../../configs/App.config';
import ScenariorunService from '../../../../services/scenariorun/ScenariorunService';

// generators function
export function * launchScenario (action) {
  const workspaceId = action.workspaceId;
  const scenarioId = action.scenarioId;

  // Update scenario
  yield put({
    type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
    data: {
      status: STATUSES.SAVING,
      scenario: { state: SCENARIO_RUN_STATE.RUNNING }
    }
  });

  // Launch scenario if parameters update succeeded
  const { error: runError, data: runData } = yield call(
    ScenariorunService.runScenario, ORGANISATION_ID, workspaceId, scenarioId);

  if (runError) {
    console.error(runError);
  } else {
    // Get csmSimulationRun id
    const csmSimulationRun = runData.csmSimulationRun;
    if (csmSimulationRun === undefined) {
      console.error('csmSimulationRun is undefined');
      yield put({
        type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
        data: { status: STATUSES.ERROR }
      });
    } else {
      // Update current scenario status to 'Running'
      yield put({
        type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
        data: {
          status: STATUSES.IDLE,
          scenario: { state: SCENARIO_RUN_STATE.RUNNING, csmSimulationRun: csmSimulationRun }
        }
      });
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
function * launchScenarioSaga () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.LAUNCH_SCENARIO, launchScenario);
}

export default launchScenarioSaga;
