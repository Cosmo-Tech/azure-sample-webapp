// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { call, delay, put, race, select, take, takeLatest } from 'redux-saga/effects';
import { SUPERSET_TOKEN_MAX_RETRIES, SUPERSET_TOKEN_POLLING_DELAY } from '../../../services/config/FunctionalConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { SupersetService } from '../../../services/superset/SupersetService';
import { CHART_ACTIONS_KEY } from '../constants';
import { setSupersetGuestToken } from '../reducers';

const REFRESH_MARGIN_MS = 45_000;
const DEFAULT_ERROR_STATE = { data: { token: null, expiry: null }, status: STATUSES.ERROR };

const getSupersetChartsConfig = (state) => state?.workspace?.current?.data?.additionalData?.webapp?.charts;
const getOrganizationId = (state) => state?.organization?.current?.data?.id;
const getWorkspaceId = (state) => state?.workspace?.current?.data?.id;

const extractDashboardIds = (chartsConfig) => {
  const dashboards = chartsConfig?.dashboards ?? [];
  return dashboards.map((dashboard) => dashboard.id);
};

const getRetryDelay = (consecutiveErrors) =>
  consecutiveErrors <= SUPERSET_TOKEN_MAX_RETRIES ? SUPERSET_TOKEN_POLLING_DELAY : 0;

const getRefreshDelay = (expiry) => (expiry == null ? 0 : new Date(expiry).getTime() - Date.now() - REFRESH_MARGIN_MS);

function* putError(error) {
  yield put(setSupersetGuestToken({ ...DEFAULT_ERROR_STATE, error }));
}

const getStartupError = (organizationId, workspaceId, dashboardIds) => {
  if (!organizationId || !workspaceId) return { message: 'Missing organizationId or workspaceId' };
  if (dashboardIds.length === 0) return { message: 'No dashboard IDs configured' };
  return null;
};

function* fetchTokenOnce(organizationId, workspaceId, dashboardIds, consecutiveErrors) {
  try {
    const response = yield SupersetService.getSupersetGuestToken(organizationId, workspaceId, dashboardIds);
    if (response?.error) {
      yield* putError(response.error);
      return { consecutiveErrors: consecutiveErrors + 1, tokenDelay: getRetryDelay(consecutiveErrors + 1) };
    }
    const data = { token: response.token, expiry: response.expiry };
    yield put(setSupersetGuestToken({ data, error: null, status: STATUSES.SUCCESS }));
    return { consecutiveErrors: 0, tokenDelay: getRefreshDelay(response.expiry) };
  } catch (error) {
    console.error(error);
    yield* putError(error);
    return { consecutiveErrors: consecutiveErrors + 1, tokenDelay: getRetryDelay(consecutiveErrors + 1) };
  }
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
    yield put(setSupersetGuestToken({ data: { token: null, expiry: null }, status: STATUSES.DISABLED }));
    return;
  }

  const dashboardIds = extractDashboardIds(chartsConfig);
  const startupError = getStartupError(organizationId, workspaceId, dashboardIds);
  if (startupError) {
    yield* putError(startupError);
    return;
  }

  yield put(setSupersetGuestToken({ status: STATUSES.LOADING }));

  let tokenDelay;
  let consecutiveErrors = 0;
  do {
    ({ consecutiveErrors, tokenDelay } = yield* fetchTokenOnce(
      organizationId,
      workspaceId,
      dashboardIds,
      consecutiveErrors
    ));
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
