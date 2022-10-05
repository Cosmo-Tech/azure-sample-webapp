// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Auth } from '@cosmotech/core';
import { put, takeEvery } from 'redux-saga/effects';
import { SecurityUtils } from '../../../../utils';
import { AUTH_ACTIONS_KEY, AUTH_STATUS } from '../../../commons/AuthConstants';
import { PERMISSIONS_BY_APP_ROLE } from '../../../../services/config/accessControl';

const UNKNOWN_ERROR_MESSAGE =
  'Unknown error. Authentication failed\nIf the problem persists, please contact your administrator.';

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
      // TODO remove users roles reception on login ?
      const userRole = Auth.getUserRoles()[0];
      const userPermissions = SecurityUtils.getPermissionsFromRole(userRole, PERMISSIONS_BY_APP_ROLE);

      // If the user is authenticated, set the auth data
      yield put({
        error: '',
        type: AUTH_ACTIONS_KEY.SET_AUTH_DATA,
        userEmail: Auth.getUserEmail(),
        userId: Auth.getUserId(),
        userName: Auth.getUserName(),
        profilePic: Auth.getUserPicUrl(),
        role: userRole,
        permissions: userPermissions,
        status: AUTH_STATUS.AUTHENTICATED,
      });
      localStorage.removeItem('logoutByTimeout');
    } else {
      yield put({
        error: '',
        type: AUTH_ACTIONS_KEY.SET_AUTH_DATA,
        userEmail: '',
        userId: '',
        userName: '',
        profilePic: '',
        role: null,
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
      userEmail: '',
      userId: '',
      userName: '',
      profilePic: '',
      role: null,
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
