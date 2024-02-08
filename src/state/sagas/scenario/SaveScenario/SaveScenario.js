// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { ApiUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* saveScenario(action, throwOnError = false) {
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
      scenario: { parametersValues: updateData.parametersValues, lastUpdate: updateData.lastUpdate },
    });
  } catch (error) {
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.ERROR,
    });

    if (throwOnError) throw error;

    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'commoncomponents.banner.update',
          "A problem occurred during scenario update; your new parameters haven't been saved."
        )
      )
    );
  }
}

function* saveScenarioSaga() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.SAVE_SCENARIO, saveScenario);
}

export default saveScenarioSaga;
