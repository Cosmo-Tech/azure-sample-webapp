// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import scenarioSaga from './scenario';
import appSaga from './app';

export default function * rootSaga () {
  yield all([
    fork(scenarioSaga),
    fork(appSaga)
  ]);
}
