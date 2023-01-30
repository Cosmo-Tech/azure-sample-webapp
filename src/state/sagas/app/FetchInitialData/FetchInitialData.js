// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call, select } from 'redux-saga/effects';
import { APPLICATION_ACTIONS_KEY } from '../../../commons/ApplicationConstants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { STATUSES } from '../../../commons/Constants';
import { getAllWorkspaces } from '../../workspace/GetAllWorkspaces/GetAllWorkspaces';
import { fetchAllDatasetsData } from '../../datasets/FindAllDatasets/FindAllDatasets';
import { fetchOrganizationById } from '../../organization/FindOrganizationById/FindOrganizationById';
import { parseError } from '../../../../utils/ErrorsUtils';
import { Api } from '../../../../services/config/Api';
import { matchPath } from 'react-router-dom';
import ConfigService from '../../../../services/ConfigService';

const ORGANIZATION_ID = ConfigService.getParameterValue('ORGANIZATION_ID');

const getWorkspaces = (state) => state?.workspace?.list?.data;
const providedUrlBeforeSignIn = sessionStorage.getItem('providedUrlBeforeSignIn');
const providedUrl = window.location.pathname;
const path = matchPath(':firstParam/*', providedUrlBeforeSignIn || providedUrl);
const firstParam = path?.params?.firstParam;
const isRedirectedToWorkspaces = !firstParam || ['workspaces', 'sign-in', 'accessDenied'].includes(firstParam);
let providedWorkspaceId;
sessionStorage.removeItem('providedUrl');
if (!isRedirectedToWorkspaces) {
  providedWorkspaceId = firstParam;
  sessionStorage.setItem('providedUrl', providedUrl);
}

export function* fetchAllInitialData() {
  yield put({
    type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
    status: STATUSES.LOADING,
  });

  try {
    const { data: organizationPermissions } = yield call(Api.Organizations.getAllPermissions);
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_PERMISSIONS_MAPPING,
      organizationPermissions,
    });
  } catch (error) {
    console.error(error);
    const errorDetails = parseError(error);
    if (error?.response?.status === 404) {
      errorDetails.detail += '\nPlease make sure you are using at least v2 of Cosmo Tech API';
    }
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.ERROR,
      error: errorDetails,
    });
    return;
  }

  try {
    // TODO: fork datasets download, or change the datasets usage in app to download them only when necessary
    yield call(fetchAllDatasetsData, ORGANIZATION_ID);
    yield call(fetchOrganizationById, ORGANIZATION_ID);
    yield call(getAllWorkspaces, ORGANIZATION_ID);
  } catch (error) {
    const errorDetails = parseError(error);
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.ERROR,
      error: errorDetails,
    });
  }
  const workspaces = yield select(getWorkspaces);
  if (providedWorkspaceId) {
    yield put({
      type: WORKSPACE_ACTIONS_KEY.SELECT_WORKSPACE,
      workspaceId: providedWorkspaceId,
    });
  } else if (workspaces?.length === 1) {
    yield put({
      type: WORKSPACE_ACTIONS_KEY.SELECT_WORKSPACE,
      workspaceId: workspaces[0].id,
    });
  } else {
    yield put({
      type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS,
      status: STATUSES.SUCCESS,
    });
  }
}

function* watchGetAllInitialData() {
  yield takeEvery(APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA, fetchAllInitialData);
}

export default watchGetAllInitialData;
