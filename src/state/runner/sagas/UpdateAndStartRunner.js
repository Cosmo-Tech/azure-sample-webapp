// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { startRunner } from './StartRunner';
import { callUpdateRunner } from './UpdateRunner';

export function* updateAndStartRunner(action) {
  try {
    yield call(callUpdateRunner, action, true);
    yield call(startRunner, action);
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t(
          'commoncomponents.banner.launchCanceled',
          "A problem occurred during scenario save; new parameters haven't been saved and launch has been canceled."
        ),
      })
    );
  }
}

function* updateAndStartRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.UPDATE_AND_START_RUNNER, updateAndStartRunner);
}

export default updateAndStartRunnerSaga;
