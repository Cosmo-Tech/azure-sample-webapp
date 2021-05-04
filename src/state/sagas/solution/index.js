// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { findSolutionByIdData } from './FindSolutionById';

export default function * solutionSaga () {
  yield all([
    fork(findSolutionByIdData)
  ]);
}
