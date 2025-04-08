// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { put, takeEvery } from 'redux-saga/effects';
import { Auth } from '@cosmotech/core';
import { AUTH_ACTIONS_KEY, AUTH_STATUS } from '../constants';
import { setAuthData } from '../reducers';

// Generator function to fetch authentication data
export function* tryLogOut(action) {
  try {
    sessionStorage.setItem('logoutInProgress', true);
    if (action.data.timeout) {
      localStorage.setItem('logoutByTimeout', true);
    }
    yield Auth.signOut();
    yield put(
      setAuthData({
        status: AUTH_STATUS.DISCONNECTING,
      })
    );
  } catch (error) {
    console.error(error);
  }
}

// Watch authentication actions
function* logOut() {
  yield takeEvery(AUTH_ACTIONS_KEY.REQUEST_LOG_OUT, tryLogOut);
}

export default logOut;
