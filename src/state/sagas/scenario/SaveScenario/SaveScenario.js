// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { ApiUtils } from '../../../../utils';
import { Api } from '../../../../services/config/Api';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

// generators function
export function* saveScenario(action) {
  const organizationId = action.organizationId;
  const workspaceId = action.workspaceId;
  const scenarioId = action.scenarioId;
  const scenarioParameters = action.scenarioParameters;

  try {
    // Update scenario parameters
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.SAVING,
    });
    const { data: updateData } = yield call(
      Api.Scenarios.updateScenario,
      organizationId,
      workspaceId,
      scenarioId,
      ApiUtils.formatParametersForApi(scenarioParameters)
    );
    updateData.parametersValues = ApiUtils.formatParametersFromApi(updateData.parametersValues);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.SUCCESS,
      scenario: { parametersValues: updateData.parametersValues },
    });
  } catch (error) {
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'commoncomponents.banner.update',
          "A problem occurred during scenario update; your new parameters haven't been saved."
        )
      )
    );
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.ERROR,
    });
    throw error;
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named SAVE_SCENARIO
// and binds createScenario saga to it
function* saveScenarioSaga() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.SAVE_SCENARIO, saveScenario);
}

export default saveScenarioSaga;
