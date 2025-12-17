// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { delay, put, select, takeLatest } from 'redux-saga/effects';
import { ENV } from '../../../services/config/EnvironmentVariables';
import { POWER_BI_INFO_POLLING_DELAY } from '../../../services/config/FunctionalConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { PowerBIService } from '../../../services/powerbi/PowerBIService';
import { PowerBIUtils } from '../../../utils';
import { CHART_ACTIONS_KEY } from '../constants';
import { setPowerBIEmbedInfo, setUseWebappTheme } from '../reducers';

const IS_POWERBI_POLLING_DISABLED = !!ENV.VITE_NO_POWERBI_POLLING;
const noAccess = {
  accessToken: '',
  reportsInfo: '',
  expiry: '',
};

const getLogInWithUserCredentials = (state) =>
  state?.workspace?.current?.data?.additionalData?.webapp?.charts?.logInWithUserCredentials;
const getPowerBIWorkspaceId = (state) => state?.workspace?.current?.data?.additionalData?.webapp?.charts?.workspaceId;
const getPowerBIChartsConfig = (state) => state?.workspace?.current?.data?.additionalData?.webapp?.charts;
const getUseWebappTheme = (state) => state?.workspace?.current?.data?.additionalData?.webapp?.charts?.useWebappTheme;

export function* getPowerBIEmbedInfoSaga() {
  const logInWithUserCredentials = yield select(getLogInWithUserCredentials);
  const powerBIWorkspaceId = yield select(getPowerBIWorkspaceId);
  const powerBIChartsConfig = yield select(getPowerBIChartsConfig);
  const useWebappTheme = yield select(getUseWebappTheme);

  if (powerBIChartsConfig == null) {
    console.warn(
      'PowerBI charts configuration could not be found and results display has been disabled. ' +
        'If you want to activate it, please configure the dashboards to be displayed in your workspace, ' +
        'in [workspace].additionalData.webapp.charts'
    );
    yield put(
      setPowerBIEmbedInfo({
        data: noAccess,
        status: STATUSES.DISABLED,
      })
    );
    return;
  }

  if (useWebappTheme != null) {
    yield put(setUseWebappTheme(useWebappTheme));
  }

  if (logInWithUserCredentials == null) {
    console.warn(
      '"logInWithUserCredentials" option is not set in the current workspace, trying to use account service...\n' +
        'Please configure the following option in your workspace: ' +
        '[workspace].additionalData.webapp.charts.logInWithUserCredentials'
    );
  }

  yield put(setPowerBIEmbedInfo({ status: STATUSES.LOADING }));

  let tokenDelay;
  do {
    try {
      const reportsIds = PowerBIUtils.getReportsIdsFromConfig(powerBIChartsConfig);
      const response = yield PowerBIService.getPowerBIData(powerBIWorkspaceId, reportsIds, logInWithUserCredentials);
      const error = response?.error;

      if (error) {
        yield put(
          setPowerBIEmbedInfo({
            data: noAccess,
            error,
            status: STATUSES.ERROR,
          })
        );
        tokenDelay = POWER_BI_INFO_POLLING_DELAY;
      } else {
        const accesses = response?.accesses;
        yield put(
          setPowerBIEmbedInfo({
            data: accesses,
            error: null,
            status: STATUSES.SUCCESS,
          })
        );
        if (accesses?.expiry == null) {
          console.warn('Expiration delay of PowerBI token not provided. Token refresh may not work as expected.');
          tokenDelay = 0;
        } else {
          tokenDelay = Date.parse(accesses.expiry) - Date.now() - 120000;
        }
      }
    } catch (error) {
      console.error(error);
      yield put(
        setPowerBIEmbedInfo({
          data: noAccess,
          error,
          status: STATUSES.ERROR,
        })
      );
      tokenDelay = POWER_BI_INFO_POLLING_DELAY;
    }

    if (IS_POWERBI_POLLING_DISABLED) tokenDelay = 0;
    else yield delay(tokenDelay);
  } while (tokenDelay);
}

function* getPowerBIEmbedInfoData() {
  yield takeLatest(CHART_ACTIONS_KEY.GET_EMBED_INFO, getPowerBIEmbedInfoSaga);
}
export default getPowerBIEmbedInfoData;
