// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import scenarioSaga from './scenario';
import appSaga from './app';
import datasetSaga from './datasets';
import workspaceSaga from './workspace';
import solutionSaga from './solution';
import authSaga from './auth';
import powerBISaga from './powerbi';

export default function * rootSaga () {
  yield all([
    fork(authSaga),
    fork(appSaga),
    fork(workspaceSaga),
    fork(solutionSaga),
    fork(scenarioSaga),
    fork(datasetSaga),
    fork(powerBISaga)
  ]);
}
