// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import scenarioSaga from './scenario';
import scenarioRunSaga from './scenarioRun';
import appSaga from './app';
import datasetSaga from './datasets';
import organizationSaga from './organization';
import workspaceSaga from './workspace';
import solutionSaga from './solution';
import authSaga from './auth';
import powerBISaga from './powerbi';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(appSaga),
    fork(organizationSaga),
    fork(workspaceSaga),
    fork(solutionSaga),
    fork(scenarioSaga),
    fork(scenarioRunSaga),
    fork(datasetSaga),
    fork(powerBISaga),
  ]);
}
