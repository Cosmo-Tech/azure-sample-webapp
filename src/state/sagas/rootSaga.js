// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import scenarioSaga from './scenario';
import appSaga from './app';
import authSaga from './auth';

export default function * rootSaga () {
  yield all([
    fork(scenarioSaga),
    fork(appSaga),
    fork(authSaga)
  ]);
}
