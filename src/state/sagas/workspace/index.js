// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { watchSelectWorkspace } from './SelectWorkspace';
import { watchGetAllWorkspaces } from './GetAllWorkspaces';

export default function* workspaceSaga() {
  yield all([fork(watchSelectWorkspace)]);
  yield all([fork(watchGetAllWorkspaces)]);
}
