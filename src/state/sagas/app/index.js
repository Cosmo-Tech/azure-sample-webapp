// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { getAllInitialData } from './FetchInitialData';

export default function * appSaga () {
  yield all([
    fork(getAllInitialData)
  ]);
}
