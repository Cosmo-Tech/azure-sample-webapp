// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, fork } from 'redux-saga/effects';
import appSaga from './app';
import authSaga from './auth';
import datasetSaga from './datasets';
import organizationSaga from './organization';
import powerBISaga from './powerbi';
import runnerSaga from './runner';
import scenarioSaga from './scenario';
import scenarioRunSaga from './scenarioRun';
import solutionSaga from './solution';
import workspaceSaga from './workspace';

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
    fork(runnerSaga),
    fork(powerBISaga),
  ]);
}
