// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANISATION_ID } from '../../../../configs/App.config';
import ScenarioService from '../../../../services/scenario/ScenarioService';
import ScenariorunService from '../../../../services/scenariorun/ScenariorunService';
import { STATUSES } from '../../../commons/Constants';

// generators function
export function * updateAndLaunchScenario (action) {
  const workspaceId = action.workspaceId;
  const scenarioId = action.scenarioId;
  const scenarioParameters = action.scenarioParameters;
  // Update scenario parameters
  const { error: updateError, data: updateData } = yield call(
    ScenarioService.updateScenarioParameters, ORGANISATION_ID, workspaceId,
    scenarioId, scenarioParameters);
  if (updateError) {
    console.error('Failed to update scenario parameters');
    console.error(updateError);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.IDLE }
    });
  } else {
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.SUCCESS, scenario: { parametersValues: updateData } }
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
      } else {
        yield put({
          type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
          data: {
            status: STATUSES.SUCCESS,
            scenario: { csmSimulationRun: csmSimulationRun }
          }
        });
      }
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
