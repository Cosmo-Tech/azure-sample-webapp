// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import scenarioSaga from './scenario';

export default function * rootSaga () {
  yield all([
    fork(scenarioSaga)
  ]);
}
