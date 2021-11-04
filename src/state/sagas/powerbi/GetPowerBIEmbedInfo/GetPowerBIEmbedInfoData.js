// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { delay, put, takeEvery } from 'redux-saga/effects';
import { GET_EMBED_INFO_URL, POWER_BI_ACTIONS_KEY } from '../../../commons/PowerBIConstants';
import { STATUSES } from '../../../commons/Constants';
import { clientApi } from '../../../../services/ClientApi';
import { POWER_BI_INFO_POLLING_DELAY } from '../../../../config/AppConfiguration';
import { POWER_BI_SSO } from '../../../../config/AppInstance';
import { PowerBIService } from '../../../../services/powerbi/PowerBIService';

// generators function
export function* getPowerBIEmbedInfoSaga() {
  let tokenDelay;
  do {
    try {
      let data, error;
      if (POWER_BI_SSO) {
        const result = yield PowerBIService.getPowerBIData();
        data = result?.data;
        error = result?.error;
      } else {
        const result = yield clientApi.get(GET_EMBED_INFO_URL);
        data = result?.data;
        error = result?.data?.error;
      }

      if (error) {
        yield put({
          type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
          embedInfo: {
            accessToken: '',
            reportsInfo: '',
            expiry: '',
          },
          error: error,
          status: STATUSES.ERROR,
        });
        tokenDelay = POWER_BI_INFO_POLLING_DELAY;
      } else {
        yield put({
          type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
          embedInfo: data,
          status: STATUSES.SUCCESS,
        });
        tokenDelay = Date.parse(data.expiry) - Date.now() - 120000;
      }

      yield delay(tokenDelay);
    } catch (error) {
      console.error("Can't retrieve PowerBI token for embed reports");
      console.error(error);
      yield put({
        type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
        embedInfo: {
          accessToken: '',
          reportsInfo: '',
          expiry: '',
        },
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
