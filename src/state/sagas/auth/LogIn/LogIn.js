// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Auth } from '@cosmotech/core';
import { put, takeEvery } from 'redux-saga/effects';
import { AUTH_ACTIONS_KEY, AUTH_STATUS } from '../../../commons/AuthConstants';

// Generator function to fetch authentication data
export function * tryLogIn (action) {
  try {
    // Start by signing in if an authentication provider is defined
    if (action.provider) {
      Auth.setProvider(action.provider);
      Auth.signIn();
    }
    // Check if the user is authenticated
    const authenticated = yield Auth.isUserSignedIn();
    if (authenticated) {
      // If the user is authenticated, set the auth data
      yield put({
        type: AUTH_ACTIONS_KEY.SET_AUTH_DATA,
        userId: Auth.getUserId(),
        userName: Auth.getUserName(),
        profilePic: Auth.getUserPicUrl(),
        status: AUTH_STATUS.AUTHENTICATED
      });
    } else {
      yield put({
        type: AUTH_ACTIONS_KEY.SET_AUTH_DATA,
        userId: '',
        userName: '',
        profilePic: '',
        status: AUTH_STATUS.DENIED
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// Watch authentication actions
function * logIn () {
  yield takeEvery(AUTH_ACTIONS_KEY.REQUEST_LOG_IN, tryLogIn);
}

export default logIn;
