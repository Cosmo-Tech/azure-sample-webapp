// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { getPowerBIEmbedInfoData } from './GetPowerBIEmbedInfo';

export default function * powerBISaga () {
  yield all([
    fork(getPowerBIEmbedInfoData)
  ]);
}
