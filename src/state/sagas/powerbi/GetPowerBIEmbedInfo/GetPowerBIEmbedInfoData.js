// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { delay, put, select, takeEvery } from 'redux-saga/effects';
import { POWER_BI_ACTIONS_KEY } from '../../../commons/PowerBIConstants';
import { STATUSES } from '../../../commons/Constants';
import { POWER_BI_INFO_POLLING_DELAY } from '../../../../services/config/FunctionalConstants';
import { PowerBIService } from '../../../../services/powerbi/PowerBIService';
import { PowerBIUtils } from '../../../../utils';

const IS_POWERBI_POLLING_DISABLED = !!process.env.REACT_APP_NO_POWERBI_POLLING;
const noAccess = {
  accessToken: '',
  reportsInfo: '',
  expiry: '',
};

const getLogInWithUserCredentials = (state) =>
  state?.workspace?.current?.data?.webApp?.options?.charts?.logInWithUserCredentials;
const getPowerBIWorkspaceId = (state) => state?.workspace?.current?.data?.webApp?.options?.charts?.workspaceId;
const getPowerBIChartsConfig = (state) => state?.workspace?.current?.data?.webApp?.options?.charts;

// generators function
export function* getPowerBIEmbedInfoSaga() {
  const logInWithUserCredentials = yield select(getLogInWithUserCredentials);
  const powerBIWorkspaceId = yield select(getPowerBIWorkspaceId);
  const powerBIChartsConfig = yield select(getPowerBIChartsConfig);
  if (logInWithUserCredentials == null) {
    console.warn(
      '"logInWithUserCredentials" option is not set in the current workspace, trying to use account service...\n' +
        'Please configure the following option in your workspace: ' +
        '[workspace].webApp.options.charts.logInWithUserCredentials'
    );
  }

  let tokenDelay;
  do {
    try {
      const reportsIds = PowerBIUtils.getReportsIdsFromConfig(powerBIChartsConfig);
      const response = yield PowerBIService.getPowerBIData(powerBIWorkspaceId, reportsIds, logInWithUserCredentials);
      const error = response?.error;

      if (error) {
        yield put({
          type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
          data: noAccess,
          error: error,
          status: STATUSES.ERROR,
        });
        tokenDelay = POWER_BI_INFO_POLLING_DELAY;
      } else {
        const accesses = response?.accesses;
        yield put({
          type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
          data: accesses,
          error: null,
          status: STATUSES.SUCCESS,
        });
        tokenDelay = Date.parse(accesses.expiry) - Date.now() - 120000;
      }

      yield delay(tokenDelay);
    } catch (error) {
      console.error("Can't retrieve PowerBI token for embed reports");
      console.error(error);
      yield put({
        type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
        data: noAccess,
        error: error,
        status: STATUSES.ERROR,
      });
      if (IS_POWERBI_POLLING_DISABLED) tokenDelay = 0;
      else {
        tokenDelay = POWER_BI_INFO_POLLING_DELAY;
        yield delay(tokenDelay);
      }
    }
  } while (tokenDelay);
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_EMBED_INFO and binds getPowerBIEmbedInfo saga to it
function* getPowerBIEmbedInfoData() {
  yield takeEvery(POWER_BI_ACTIONS_KEY.GET_EMBED_INFO, getPowerBIEmbedInfoSaga);
}

export default getPowerBIEmbedInfoData;
