// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* renameScenario(action) {
  try {
    const { organizationId, workspaceId, scenarioId, scenarioName } = action;
    yield call(Api.Scenarios.updateScenario, organizationId, workspaceId, scenarioId, { name: scenarioName });
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_SCENARIO_NAME,
      scenarioId,
      name: scenarioName,
    });
  } catch (error) {
    yield put(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.rename', "Scenario hasn't been renamed."))
    );
  }
}

function* renameScenarioSaga() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.RENAME_SCENARIO, renameScenario);
}

export default renameScenarioSaga;
