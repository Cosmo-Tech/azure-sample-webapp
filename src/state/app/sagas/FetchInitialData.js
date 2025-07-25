// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { matchPath } from 'react-router-dom';
import { put, takeEvery, call } from 'redux-saga/effects';
import ConfigService from '../../../services/ConfigService';
import { Api } from '../../../services/config/Api';
import { DATASET_PERMISSIONS_MAPPING, RUNNER_PERMISSIONS_MAPPING } from '../../../services/config/ApiConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { RouterUtils } from '../../../utils';
import { parseError } from '../../../utils/ErrorsUtils';
import { fetchAllDatasetsData } from '../../datasets/sagas/FindAllDatasets';
import { fetchOrganizationById } from '../../organizations/sagas/FindOrganizationById';
import { WORKSPACE_ACTIONS_KEY } from '../../workspaces/constants';
import { getAllWorkspaces } from '../../workspaces/sagas/GetAllWorkspaces';
import { APPLICATION_ACTIONS_KEY } from '../constants';
import { setApplicationStatus, setPermissionsMapping } from '../reducers';

const ORGANIZATION_ID = ConfigService.getParameterValue('ORGANIZATION_ID');

const providedUrlBeforeSignIn = sessionStorage.getItem('providedUrlBeforeSignIn');
const relativePath = RouterUtils.getLocationRelativePath(providedUrlBeforeSignIn ?? window.location.pathname);
const firstParam = matchPath(':firstParam/*', relativePath)?.params?.firstParam;
const isRedirectedToWorkspaces = !firstParam || ['workspaces', 'sign-in', 'accessDenied'].includes(firstParam);
let providedWorkspaceId;
sessionStorage.removeItem('providedUrl');
if (!isRedirectedToWorkspaces) {
  providedWorkspaceId = firstParam;
  sessionStorage.setItem('providedUrl', relativePath);
}

export function* fetchAllInitialData() {
  yield put(
    setApplicationStatus({
      status: STATUSES.LOADING,
    })
  );

  try {
    const { data: organizationPermissions } = yield call(Api.Organizations.getAllPermissions);
    organizationPermissions.push({ component: 'dataset', roles: DATASET_PERMISSIONS_MAPPING });
    organizationPermissions.push({ component: 'runner', roles: RUNNER_PERMISSIONS_MAPPING });
    yield put(
      setPermissionsMapping({
        organizationPermissions,
      })
    );
  } catch (error) {
    console.error(error);
    const errorDetails = parseError(error);
    if (error?.response?.status === 404) {
      errorDetails.detail += '\nPlease make sure you are using at least v2 of Cosmo Tech API';
    }
    yield put(
      setApplicationStatus({
        status: STATUSES.ERROR,
        error: errorDetails,
      })
    );
    return;
  }

  try {
    // TODO: fork datasets download, or change the datasets usage in app to download them only when necessary
    yield call(fetchAllDatasetsData, ORGANIZATION_ID);
    yield call(fetchOrganizationById, ORGANIZATION_ID);
    yield call(getAllWorkspaces, ORGANIZATION_ID);
  } catch (error) {
    const errorDetails = parseError(error);
    yield put(
      setApplicationStatus({
        status: STATUSES.ERROR,
        error: errorDetails,
      })
    );
  }
  if (providedWorkspaceId) {
    yield put({
      type: WORKSPACE_ACTIONS_KEY.SELECT_WORKSPACE,
      workspaceId: providedWorkspaceId,
    });
  } else {
    yield put(
      setApplicationStatus({
        status: STATUSES.SUCCESS,
      })
    );
  }
}

function* watchGetAllInitialData() {
  yield takeEvery(APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA, fetchAllInitialData);
}

export default watchGetAllInitialData;
