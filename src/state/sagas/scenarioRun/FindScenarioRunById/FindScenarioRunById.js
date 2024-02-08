// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { SCENARIO_RUN_ACTIONS } from '../../../commons/ScenarioRunConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* findScenarioRunById(action) {
  // First, get the scenario run
  try {
    const { data } = yield call(Api.ScenarioRuns.findScenarioRunById, action.organizationId, action.scenarioRunId);
    yield put({ type: SCENARIO_RUN_ACTIONS.ADD_OR_UPDATE, data });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('views.scenario.scenarioRunQueryError.comment', 'Could not find scenario run with id "{{id}}".', {
          id: action.scenarioRunId,
        })
      )
    );
    // Add empty object in store to prevent multiple calls to the back-end if queries are failing
    yield put({ type: SCENARIO_RUN_ACTIONS.ADD_OR_UPDATE, data: { id: action.scenarioRunId, error: true } });
    return;
  }
  // Then, get the scenario run status
  try {
    const { data } = yield call(Api.ScenarioRuns.getScenarioRunStatus, action.organizationId, action.scenarioRunId);
    yield put({ type: SCENARIO_RUN_ACTIONS.SET_RUN_STATUS, data });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'views.scenario.scenarioRunStatusQueryError.comment',
          'Could not get status of scenario run with id "{{id}}".',
          {
            id: action.scenarioRunId,
          }
        )
      )
    );
  }
}

function* watchFetchScenarioRunById() {
  yield takeEvery(SCENARIO_RUN_ACTIONS.FETCH, findScenarioRunById);
}

export default watchFetchScenarioRunById;
