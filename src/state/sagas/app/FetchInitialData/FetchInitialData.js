// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { matchPath } from 'react-router-dom';
import { put, takeEvery, call } from 'redux-saga/effects';
import ConfigService from '../../../../services/ConfigService';
import { Api } from '../../../../services/config/Api';
import { DATASET_PERMISSIONS_MAPPING } from '../../../../services/config/ApiConstants';
import { parseError } from '../../../../utils/ErrorsUtils';
import { APPLICATION_ACTIONS_KEY } from '../../../commons/ApplicationConstants';
import { STATUSES } from '../../../commons/Constants';
import { WORKSPACE_ACTIONS_KEY } from '../../../commons/WorkspaceConstants';
import { fetchAllDatasetsData } from '../../datasets/FindAllDatasets/FindAllDatasets';
import { fetchOrganizationById } from '../../organization/FindOrganizationById/FindOrganizationById';
import { getAllWorkspaces } from '../../workspace/GetAllWorkspaces/GetAllWorkspaces';

const ORGANIZATION_ID = ConfigService.getParameterValue('ORGANIZATION_ID');

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
    organizationPermissions.push({ component: 'dataset', roles: DATASET_PERMISSIONS_MAPPING });
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
  if (providedWorkspaceId) {
    yield put({
      type: WORKSPACE_ACTIONS_KEY.SELECT_WORKSPACE,
      workspaceId: providedWorkspaceId,
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
