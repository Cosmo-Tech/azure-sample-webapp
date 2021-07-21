// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth, ApiUtils } from '@cosmotech/core';
import { takeEvery } from 'redux-saga/effects';
import { AUTH_ACTIONS_KEY } from '../../../commons/AuthConstants';
import { CosmotechApiService } from '../../../../configs/Api.config';

// Generator function to fetch authentication data
export function * tryLogOut () {
  try {
    ApiUtils.resetAccessToken(CosmotechApiService);
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
