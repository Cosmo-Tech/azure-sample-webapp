// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, fork } from 'redux-saga/effects';
import { watchGetAllInitialData } from './FetchInitialData';

export default function* appSaga() {
  yield all([fork(watchGetAllInitialData)]);
}
