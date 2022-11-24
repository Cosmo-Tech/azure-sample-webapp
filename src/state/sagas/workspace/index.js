// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { findWorkspaceByIdData } from './FindWorkspaceById';
import { watchGetAllWorkspaces } from './GetAllWorkspaces';

export default function* workspaceSaga() {
  yield all([fork(findWorkspaceByIdData)]);
  yield all([fork(watchGetAllWorkspaces)]);
}
