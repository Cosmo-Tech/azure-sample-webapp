// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import ScenarioService from '../../../../services/scenario/ScenarioService';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import { SCENARIO_RUN_STATE } from '../../../../utils/ApiUtils';

// generators function
export function * fetchScenarioByIdForInitialData (workspaceId, scenarioId) {
  // yield keyword is here to milestone and save the action
  const { error, data } = yield call(ScenarioService.findScenarioById, ORGANIZATION_ID, workspaceId, scenarioId);
  if (error) {
    // TODO handle error management
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.ERROR }
    });
  } else {
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_CURRENT_SCENARIO action with data as payload
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.IDLE, scenario: data }
    });
  }
}

// generators function
export function * fetchScenarioByIdData (action) {
  const { error, data } = yield call(ScenarioService.findScenarioById, ORGANIZATION_ID, action.workspaceId, action.scenarioId);
  if (error) {
    // TODO handle error management
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.ERROR }
    });
  } else {
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_CURRENT_SCENARIO action with data as payload
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.IDLE, scenario: data }
    });
    // Start state polling for running scenarios
    if (data.state === SCENARIO_RUN_STATE.RUNNING) {
      yield put({
        type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
        workspaceId: action.workspaceId,
        scenarioId: data.id
      });
    }
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named FIND_SCENARIO_BY_ID and binds fetchScenarioByIdData saga to it
function * findScenarioByIdData () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.FIND_SCENARIO_BY_ID, fetchScenarioByIdData);
}

export default findScenarioByIdData;
