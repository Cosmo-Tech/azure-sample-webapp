// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { delay, put, takeEvery } from 'redux-saga/effects';
import { GET_EMBED_INFO_URL, POWER_BI_ACTIONS_KEY } from '../../../commons/PowerBIConstants';
import { STATUSES } from '../../../commons/Constants';
import { clientApi } from '../../../../services/ClientApi';
import { POWER_BI_INFO_POLLING_DELAY } from '../../../../config/AppConfiguration';
import { USE_POWER_BI_WITH_USER_CREDENTIALS } from '../../../../config/AppInstance';
import { PowerBIService } from '../../../../services/powerbi/PowerBIService';

const noAccess = {
  accessToken: '',
  reportsInfo: '',
  expiry: '',
};

// generators function
export function* getPowerBIEmbedInfoSaga() {
  let tokenDelay;
  do {
    try {
      let accesses, error;
      if (USE_POWER_BI_WITH_USER_CREDENTIALS) {
        const response = yield PowerBIService.getPowerBIData();
        accesses = response?.accesses;
        error = response?.error;
      } else {
        const { data } = yield clientApi.get(GET_EMBED_INFO_URL);
        accesses = data?.accesses;
        error = data?.error;
      }

      if (error) {
        yield put({
          type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
          data: noAccess,
          error: error,
          status: STATUSES.ERROR,
        });
        tokenDelay = POWER_BI_INFO_POLLING_DELAY;
      } else {
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
      yield put({
        type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
        data: noAccess,
        error: error,
        status: STATUSES.ERROR,
      });
      tokenDelay = POWER_BI_INFO_POLLING_DELAY;
      yield delay(tokenDelay);
    }
  } while (tokenDelay);
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_EMBED_INFO and binds getPowerBIEmbedInfo saga to it
function* getPowerBIEmbedInfoData() {
  yield takeEvery(POWER_BI_ACTIONS_KEY.GET_EMBED_INFO, getPowerBIEmbedInfoSaga);
}

export default getPowerBIEmbedInfoData;
