// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth } from '@cosmotech/core';
import { takeEvery } from 'redux-saga/effects';
import { AUTH_ACTIONS_KEY } from '../../../commons/AuthConstants';
import { resetAccessToken } from '../../../../configs/Api.config';

// Generator function to fetch authentication data
export function * tryLogOut () {
  try {
    resetAccessToken();
    yield Auth.signOut();
  } catch (error) {
    console.error(error);
  }
}

// Watch authentication actions
function * logOut () {
  yield takeEvery(AUTH_ACTIONS_KEY.REQUEST_LOG_OUT, tryLogOut);
}

export default logOut;
