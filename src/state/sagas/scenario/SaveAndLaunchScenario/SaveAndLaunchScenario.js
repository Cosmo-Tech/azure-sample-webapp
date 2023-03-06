// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { saveScenario } from '../SaveScenario';
import { launchScenario } from '../LaunchScenario';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { t } from 'i18next';

// generators function
export function* saveAndLaunchScenario(action) {
  try {
    yield call(saveScenario, action);
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

// generators function
// Here is a watcher that takes EVERY action dispatched named SAVE_AND_LAUNCH_SCENARIO
// and binds createScenario saga to it
function* saveAndLaunchScenarioSaga() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.SAVE_AND_LAUNCH_SCENARIO, saveAndLaunchScenario);
}

export default saveAndLaunchScenarioSaga;
