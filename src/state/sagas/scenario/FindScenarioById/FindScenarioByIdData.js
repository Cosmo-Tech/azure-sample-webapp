// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import { formatParametersFromApi, SCENARIO_RUN_STATE } from '../../../../utils/ApiUtils';
import { Api } from '../../../../configs/Api.config';

// generators function
export function * fetchScenarioByIdForInitialData (workspaceId, scenarioId) {
  try {
    const { data } = yield call(Api.Scenarios.findScenarioById, ORGANIZATION_ID, workspaceId, scenarioId);
    data.parametersValues = formatParametersFromApi(data.parametersValues);
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_CURRENT_SCENARIO action with data as payload
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.IDLE, scenario: data }
    });
  } catch (e) {
    // TODO handle error management
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.ERROR }
    });
  }
}

// generators function
export function * fetchScenarioByIdData (action) {
  try {
    const { data } = yield call(Api.Scenarios.findScenarioById, ORGANIZATION_ID, action.workspaceId, action.scenarioId);
    data.parametersValues = formatParametersFromApi(data.parametersValues);
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
  } catch (e) {
    // TODO handle error management
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.ERROR }
    });
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named FIND_SCENARIO_BY_ID and binds fetchScenarioByIdData saga to it
function * findScenarioByIdData () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.FIND_SCENARIO_BY_ID, fetchScenarioByIdData);
}

export default findScenarioByIdData;
