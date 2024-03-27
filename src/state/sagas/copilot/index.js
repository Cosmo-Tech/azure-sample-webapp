// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, fork } from 'redux-saga/effects';
import { getCopilotTokenSaga } from './GetCopilotToken';

export default function* copilotSaga() {
  yield all([fork(getCopilotTokenSaga)]);
}
