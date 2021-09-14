// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, put, delay } from 'redux-saga/effects';
import { GET_EMBED_INFO_URL, POWER_BI_ACTIONS_KEY } from '../../../commons/PowerBIConstants';
import { STATUSES } from '../../../commons/Constants';
import { clientApi } from '../../../../services/ClientApi';
import { POWER_BI_INFO_POLLING_DELAY } from '../../../../config/AppConfiguration';

// generators function
export function * getPowerBIEmbedInfoSaga () {
  let tokenDelay;
  do {
    try {
      const { data } = yield clientApi.get(GET_EMBED_INFO_URL);
      if (data.error) {
        yield put({
          type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
          embedInfo: {
            accessToken: '',
            reportsInfo: '',
            expiry: ''
          },
          error: data.error,
          status: STATUSES.ERROR
        });
        tokenDelay = POWER_BI_INFO_POLLING_DELAY;
      } else {
        yield put({
          type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
          embedInfo: data,
          status: STATUSES.SUCCESS
        });
        tokenDelay = Date.parse(data.expiry) - Date.now() - 120000;
      }

      yield delay(tokenDelay);
    } catch (error) {
      console.error('Can\'t retrieve PowerBI token for embed reports');
      console.error(error);
      yield put({
        type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
        embedInfo: {
          accessToken: '',
          reportsInfo: '',
          expiry: ''
        },
        status: STATUSES.ERROR
      });
      tokenDelay = POWER_BI_INFO_POLLING_DELAY;
      yield delay(tokenDelay);
    }
  } while (tokenDelay);
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_EMBED_INFO and binds getPowerBIEmbedInfo saga to it
function * getPowerBIEmbedInfoData () {
  yield takeEvery(POWER_BI_ACTIONS_KEY.GET_EMBED_INFO, getPowerBIEmbedInfoSaga);
}

export default getPowerBIEmbedInfoData;
