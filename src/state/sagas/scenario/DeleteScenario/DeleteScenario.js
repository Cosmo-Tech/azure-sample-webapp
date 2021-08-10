// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANIZATION_ID } from '../../../../config/AppInstance';
import { getAllScenariosData } from '../FindAllScenarios/FindAllScenariosData';
import { Api } from '../../../../services/config/Api';

export function * deleteScenario (action) {
  try {
    const workspaceId = action.workspaceId;
    yield call(Api.Scenarios.deleteScenario, ORGANIZATION_ID, workspaceId, action.scenarioId);
    yield call(getAllScenariosData, workspaceId);
  } catch (e) {
    console.error(e);
  }
}

function * deleteScenarioSaga () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.DELETE_SCENARIO, deleteScenario);
}

export default deleteScenarioSaga;
