// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, fork } from 'redux-saga/effects';
import { watchGetOrganizationById } from './FindOrganizationById';

export default function* organizationSaga() {
  yield all([fork(watchGetOrganizationById)]);
}
