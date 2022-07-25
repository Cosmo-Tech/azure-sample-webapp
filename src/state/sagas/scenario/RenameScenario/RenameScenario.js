// Copyright (c) Cosmo Tech.
// Licensed under the MIT licence.

import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANIZATION_ID } from '../../../../config/GlobalConfiguration';
import { Api } from '../../../../services/config/Api';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* renameScenario(action) {
  try {
    const { workspaceId, scenarioId, scenarioName } = action;
    yield call(Api.Scenarios.updateScenario, ORGANIZATION_ID, workspaceId, scenarioId, { name: scenarioName });
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_SCENARIO_NAME,
      scenarioId: scenarioId,
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
