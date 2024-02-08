// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { launchScenario } from '../LaunchScenario';
import { saveScenario } from '../SaveScenario';

export function* saveAndLaunchScenario(action) {
  try {
    yield call(saveScenario, action, true);
    yield call(launchScenario, action);
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'commoncomponents.banner.launchCanceled',
          "A problem occurred during scenario save; new parameters haven't been saved and launch has been canceled."
        )
      )
    );
  }
}

function* saveAndLaunchScenarioSaga() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.SAVE_AND_LAUNCH_SCENARIO, saveAndLaunchScenario);
}

export default saveAndLaunchScenarioSaga;
