// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { put, select, takeLatest } from 'redux-saga/effects';
import { STATUSES } from '../../../services/config/StatusConstants';
import { SupersetService } from '../../../services/superset/SupersetService';
import { CHART_ACTIONS_KEY } from '../constants';
import { setSupersetGuestToken } from '../reducers';

const getSupersetChartsConfig = (state) => state?.workspace?.current?.data?.additionalData?.webapp?.charts;
const getOrganizationId = (state) => state?.organization?.current?.data?.id;
const getWorkspaceId = (state) => state?.workspace?.current?.data?.id;

function extractDashboardIds(chartsConfig) {
  const dashboards = chartsConfig?.dashboards ?? [];
  return dashboards.map((dashboard) => dashboard.id);
}

export function* getSupersetGuestTokenSaga() {
  const chartsConfig = yield select(getSupersetChartsConfig);
  const organizationId = yield select(getOrganizationId);
  const workspaceId = yield select(getWorkspaceId);

  if (chartsConfig == null) {
    console.warn(
      'Superset charts configuration could not be found and results display has been disabled. ' +
        'If you want to activate it, please configure the dashboards to be displayed in your workspace, ' +
        'in [workspace].additionalData.webapp.charts'
    );
    yield put(
      setSupersetGuestToken({
        data: { token: null, expiry: null },
        status: STATUSES.DISABLED,
      })
    );
    return;
  }

  if (!organizationId || !workspaceId) {
    yield put(
      setSupersetGuestToken({
        data: { token: null, expiry: null },
        status: STATUSES.ERROR,
        error: { message: 'Missing organizationId or workspaceId' },
      })
    );
    return;
  }

  yield put(setSupersetGuestToken({ status: STATUSES.LOADING }));

  try {
    const dashboardIds = extractDashboardIds(chartsConfig);

    if (dashboardIds.length === 0) {
      console.warn('No dashboard IDs found in Superset configuration');
      yield put(
        setSupersetGuestToken({
          data: { token: null, expiry: null },
          status: STATUSES.ERROR,
          error: { message: 'No dashboard IDs configured' },
        })
      );
      return;
    }

    const response = yield SupersetService.getSupersetGuestToken(organizationId, workspaceId, dashboardIds);
    const error = response?.error;

    if (error) {
      yield put(
        setSupersetGuestToken({
          data: { token: null, expiry: null },
          error,
          status: STATUSES.ERROR,
        })
      );
    } else {
      yield put(
        setSupersetGuestToken({
          data: { token: response.token, expiry: response.expiry },
          error: null,
          status: STATUSES.SUCCESS,
        })
      );
    }
  } catch (error) {
    console.error(error);
    yield put(
      setSupersetGuestToken({
        data: { token: null, expiry: null },
        error,
        status: STATUSES.ERROR,
      })
    );
  }
}

function* getSupersetGuestTokenData() {
  yield takeLatest(CHART_ACTIONS_KEY.GET_SUPERSET_GUEST_TOKEN, getSupersetGuestTokenSaga);
}

export default getSupersetGuestTokenData;
