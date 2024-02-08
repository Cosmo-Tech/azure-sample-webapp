// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { stopScenarioRun } from '../../scenarioRun/StopScenarioRun/StopScenarioRun';
import { getAllScenariosData } from '../FindAllScenarios/FindAllScenariosData';

export function* deleteScenario(action) {
  try {
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const scenarioId = action.scenarioId;

    const response = yield call(Api.Scenarios.findScenarioById, organizationId, workspaceId, scenarioId);
    action.scenarioRunId = response.data?.lastRun?.scenarioRunId;

    if (
      response.data.state === SCENARIO_RUN_STATE.RUNNING ||
      response.data.state === SCENARIO_RUN_STATE.DATA_INGESTION_IN_PROGRESS
    ) {
      yield call(stopScenarioRun, action);
    }

    yield call(Api.Scenarios.deleteScenario, organizationId, workspaceId, scenarioId);

    yield call(getAllScenariosData, organizationId, workspaceId);
  } catch (error) {
    yield put(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.delete', "Scenario hasn't been deleted."))
    );
  }
}

function* deleteScenarioSaga() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.DELETE_SCENARIO, deleteScenario);
}

export default deleteScenarioSaga;
