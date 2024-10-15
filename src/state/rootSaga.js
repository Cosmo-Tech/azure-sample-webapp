// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, fork } from 'redux-saga/effects';
import appSaga from './app/sagas';
import authSaga from './auth/sagas';
import datasetSaga from './datasets/sagas';
import organizationSaga from './organizations/sagas';
import powerBISaga from './powerBi/sagas';
import runnerSaga from './runner/sagas';
import solutionSaga from './solutions/sagas';
import workspaceSaga from './workspaces/sagas';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(appSaga),
    fork(organizationSaga),
    fork(workspaceSaga),
    fork(solutionSaga),
    fork(datasetSaga),
    fork(runnerSaga),
    fork(powerBISaga),
  ]);
}
