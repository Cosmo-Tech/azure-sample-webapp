// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { startRunner } from '../StartRunner/StartRunner';
import { updateRunner } from '../UpdateRunner/UpdateRunner';

export function* updateAndStartRunner(action) {
  try {
    yield call(updateRunner, action, true);
    yield call(startRunner, action);
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

function* updateAndStartRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_AND_START_RUNNER, updateAndStartRunner);
}

export default updateAndStartRunnerSaga;
