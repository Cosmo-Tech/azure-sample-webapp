// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Auth } from '@cosmotech/core';
import { put, takeEvery } from 'redux-saga/effects';
import { AUTH_ACTIONS_KEY, AUTH_STATUS } from '../../../commons/AuthConstants';
import { PROFILES } from '../../../../config/Profiles';

const UNKNOWN_ERROR_MESSAGE =
  'Unknown error. Authentication failed\nIf the problem persists, please contact your administrator.';

const _extractPermissionsFromRoles = (roles) => {
  let permissions = [];
  if (roles) {
    for (const role of roles) {
      if (role in PROFILES) {
        permissions = [...new Set([...permissions, ...PROFILES[role]])];
      }
    }
  }
  return permissions;
};

// Generator function to fetch authentication data
export function* tryLogIn(action) {
  try {
    // Start by signing in if an authentication provider is defined
    if (action.provider) {
      Auth.setProvider(action.provider);
      yield Auth.signIn();
    }
    // Check if the user is authenticated
    const authenticated = yield Auth.isUserSignedIn();
    if (authenticated) {
      const userRoles = Auth.getUserRoles();
      const userPermissions = _extractPermissionsFromRoles(userRoles);
      // If the user is authenticated, set the auth data
      yield put({
        error: '',
        type: AUTH_ACTIONS_KEY.SET_AUTH_DATA,
        userId: Auth.getUserId(),
        userName: Auth.getUserName(),
        userEmail: Auth.getUserEmail(),
        profilePic: Auth.getUserPicUrl(),
        roles: userRoles,
        permissions: userPermissions,
        status: AUTH_STATUS.AUTHENTICATED,
      });
      localStorage.removeItem('logoutByTimeout');
    } else {
      yield put({
        error: '',
        type: AUTH_ACTIONS_KEY.SET_AUTH_DATA,
        userId: '',
        userName: '',
        userEmail: '',
        profilePic: '',
        roles: [],
        permissions: [],
        status: AUTH_STATUS.ANONYMOUS,
      });
    }
  } catch (error) {
    if (!error.errorMessage) console.error(error);
    const errorMessage = error.errorMessage || UNKNOWN_ERROR_MESSAGE;
    yield put({
      error: errorMessage,
      type: AUTH_ACTIONS_KEY.SET_AUTH_DATA,
      userId: '',
      userName: '',
      userEmail: '',
      profilePic: '',
      roles: [],
      permissions: [],
      status: AUTH_STATUS.DENIED,
    });
    localStorage.removeItem('logoutByTimeout');
  }
}

// Watch authentication actions
function* logIn() {
  yield takeEvery(AUTH_ACTIONS_KEY.REQUEST_LOG_IN, tryLogIn);
}

export default logIn;
