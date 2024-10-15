// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { put, takeEvery } from 'redux-saga/effects';
import { Auth } from '@cosmotech/core';
import { AUTH_ACTIONS_KEY, AUTH_STATUS } from '../constants';
import { setAuthData } from '../reducers';

const UNKNOWN_ERROR_MESSAGE =
  'Unknown error. Authentication failed\nIf the problem persists, please contact your administrator.';

export function* tryLogIn(action) {
  try {
    yield put(
      setAuthData({
        status: AUTH_STATUS.CONNECTING,
      })
    );
    if (action.provider) {
      Auth.setProvider(action.provider);
      yield Auth.signIn();
    }

    const isAuthenticated = yield Auth.isUserSignedIn();
    yield put(
      setAuthData({
        error: '',
        userEmail: isAuthenticated ? Auth.getUserEmail() : '',
        userId: isAuthenticated ? Auth.getUserId() : '',
        userName: isAuthenticated ? Auth.getUserName() : '',
        profilePic: isAuthenticated ? Auth.getUserPicUrl() : '',
        roles: isAuthenticated ? Auth.getUserRoles() : [],
        permissions: [],
        status: isAuthenticated ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.ANONYMOUS,
      })
    );

    if (isAuthenticated) localStorage.removeItem('logoutByTimeout');
  } catch (error) {
    if (!error.errorMessage) console.error(error);
    yield put(
      setAuthData({
        error: error.errorMessage ?? UNKNOWN_ERROR_MESSAGE,
        userEmail: '',
        userId: '',
        userName: '',
        profilePic: '',
        roles: [],
        permissions: [],
        status: AUTH_STATUS.DENIED,
      })
    );
    localStorage.removeItem('logoutByTimeout');
  }
}

function* logIn() {
  yield takeEvery(AUTH_ACTIONS_KEY.REQUEST_LOG_IN, tryLogIn);
}

export default logIn;
