// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { LogIn } from './LogIn';
import { LogOut } from './LogOut';

export default function * authSaga () {
  yield all([
    fork(LogIn),
    fork(LogOut)
  ]);
}
