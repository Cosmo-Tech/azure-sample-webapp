// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { findWorkspaceByIdData } from './FindWorkspaceById';

export default function * workspaceSaga () {
  yield all([
    fork(findWorkspaceByIdData)
  ]);
}
