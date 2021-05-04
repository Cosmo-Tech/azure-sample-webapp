// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import scenarioSaga from './scenario';
import appSaga from './app';
import datasetSaga from './datasets';
import workspaceSaga from './workspace';
import solutionSaga from './solution';
import authSaga from './auth';

export default function * rootSaga () {
  yield all([
    fork(scenarioSaga),
    fork(appSaga),
    fork(datasetSaga),
    fork(workspaceSaga),
    fork(solutionSaga),
    fork(authSaga)
  ]);
}
