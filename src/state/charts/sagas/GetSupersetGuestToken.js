// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { call, delay, put, race, select, take, takeLatest } from 'redux-saga/effects';
import { SUPERSET_TOKEN_MAX_RETRIES, SUPERSET_TOKEN_POLLING_DELAY } from '../../../services/config/FunctionalConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { SupersetService } from '../../../services/superset/SupersetService';
import { CHART_ACTIONS_KEY } from '../constants';
import { setSupersetGuestToken } from '../reducers';

const REFRESH_MARGIN_MS = 45_000;

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

  const dashboardIds = extractDashboardIds(chartsConfig);
  if (dashboardIds.length === 0) {
    yield put(
      setSupersetGuestToken({
        data: { token: null, expiry: null },
        status: STATUSES.ERROR,
        error: { message: 'No dashboard IDs configured' },
      })
    );
    return;
  }

  yield put(setSupersetGuestToken({ status: STATUSES.LOADING }));

  let tokenDelay;
  let consecutiveErrors = 0;
  do {
    try {
      const response = yield SupersetService.getSupersetGuestToken(organizationId, workspaceId, dashboardIds);
      const error = response?.error;

      if (error) {
        consecutiveErrors++;
        yield put(
          setSupersetGuestToken({
            data: { token: null, expiry: null },
            error,
            status: STATUSES.ERROR,
          })
        );
        tokenDelay = consecutiveErrors <= SUPERSET_TOKEN_MAX_RETRIES ? SUPERSET_TOKEN_POLLING_DELAY : 0;
      } else {
        consecutiveErrors = 0;
        yield put(
          setSupersetGuestToken({
            data: { token: response.token, expiry: response.expiry },
            error: null,
            status: STATUSES.SUCCESS,
          })
        );

        if (response.expiry == null) {
          tokenDelay = 0;
        } else {
          tokenDelay = new Date(response.expiry).getTime() - Date.now() - REFRESH_MARGIN_MS;
        }
      }
    } catch (error) {
      console.error(error);
      consecutiveErrors++;
      yield put(
        setSupersetGuestToken({
          data: { token: null, expiry: null },
          error,
          status: STATUSES.ERROR,
        })
      );
      tokenDelay = consecutiveErrors <= SUPERSET_TOKEN_MAX_RETRIES ? SUPERSET_TOKEN_POLLING_DELAY : 0;
    }

    if (tokenDelay > 0) yield delay(tokenDelay);
  } while (tokenDelay > 0);
}

function* startSupersetTokenPolling(action) {
  yield race([call(getSupersetGuestTokenSaga, action), take(CHART_ACTIONS_KEY.STOP_CHARTS_TOKEN_POLLING)]);
}

function* getSupersetGuestTokenData() {
  yield takeLatest(CHART_ACTIONS_KEY.GET_SUPERSET_GUEST_TOKEN, startSupersetTokenPolling);
}

export default getSupersetGuestTokenData;
