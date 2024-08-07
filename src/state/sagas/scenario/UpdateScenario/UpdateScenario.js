// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* updateScenario(action) {
  try {
    const { organizationId, workspaceId, scenarioId, newScenarioData } = action;
    yield call(Api.Scenarios.updateScenario, organizationId, workspaceId, scenarioId, newScenarioData);
    yield put({
      type: SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO_DATA,
      scenarioId,
      newScenarioData,
    });
  } catch (error) {
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.updateData', "Scenario hasn't been updated.")
      )
    );
  }
}

function* updateScenarioSaga() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_SCENARIO_DATA, updateScenario);
}

export default updateScenarioSaga;
