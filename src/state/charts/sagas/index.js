// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, fork } from 'redux-saga/effects';
import getPowerBIEmbedInfoData from './GetPowerBIEmbedInfoData';
import getSupersetGuestTokenData from './GetSupersetGuestToken';

export default function* chartsSaga() {
  yield all([fork(getPowerBIEmbedInfoData), fork(getSupersetGuestTokenData)]);
}
