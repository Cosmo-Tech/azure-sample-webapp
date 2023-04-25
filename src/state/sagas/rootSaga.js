// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, spawn, call } from 'redux-saga/effects';
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
  const sagas = [
    authSaga,
    appSaga,
    organizationSaga,
    workspaceSaga,
    solutionSaga,
    scenarioSaga,
    scenarioRunSaga,
    datasetSaga,
    powerBISaga,
  ];

  yield all(
    sagas.map((saga) =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            console.error(e);
          }
        }
      })
    )
  );
}
