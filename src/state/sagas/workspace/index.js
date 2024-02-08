// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, fork } from 'redux-saga/effects';
import { watchGetAllWorkspaces } from './GetAllWorkspaces';
import { watchSelectWorkspace } from './SelectWorkspace';

export default function* workspaceSaga() {
  yield all([fork(watchSelectWorkspace)]);
  yield all([fork(watchGetAllWorkspaces)]);
}
