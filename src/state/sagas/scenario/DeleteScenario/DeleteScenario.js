// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import ScenarioService from '../../../../services/scenario/ScenarioService';
import { getAllScenariosData } from '../FindAllScenarios/FindAllScenariosData';

export function * deleteScenario (action) {
  const workspaceId = action.workspaceId;
  const { error } = yield call(ScenarioService.deleteScenario, ORGANIZATION_ID, workspaceId, action.scenarioId);
  if (error) {
    throw new Error(`Error while deleting scenario "${action.scenarioId}"`);
  } else {
    yield call(getAllScenariosData, workspaceId);
  }
}

function * deleteScenarioSaga () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.DELETE_SCENARIO, deleteScenario);
}

export default deleteScenarioSaga;
