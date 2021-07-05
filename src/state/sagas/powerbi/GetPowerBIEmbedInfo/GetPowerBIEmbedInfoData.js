// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, put, delay } from 'redux-saga/effects';
import { GET_EMBED_INFO_URL, POWER_BI_ACTIONS_KEY } from '../../../commons/PowerBIConstants';
import axios from 'axios';
import { STATUSES } from '../../../commons/Constants';

// generators function
export function * getPowerBIEmbedInfoSaga () {
  let tokenDelay;

  try {
    do {
      const { error, data } = yield axios.get(GET_EMBED_INFO_URL);

      if (error) {
        console.error(error);
      } else {
        yield put({
          type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
          embedInfo: data,
          status: STATUSES.SUCCESS
        });
      }

      tokenDelay = Date.parse(data.expiry) - Date.now() - 120000;

      yield delay(tokenDelay);
    } while (tokenDelay);
  } catch (error) {
    console.error(error);
    yield put({
      type: POWER_BI_ACTIONS_KEY.SET_EMBED_INFO,
      embedInfo: {
        accessToken: '',
        embedUrl: '',
        expiry: ''
      },
      status: STATUSES.ERROR
    });
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_EMBED_INFO and binds getPowerBIEmbedInfo saga to it
function * getPowerBIEmbedInfoData () {
  yield takeEvery(POWER_BI_ACTIONS_KEY.GET_EMBED_INFO, getPowerBIEmbedInfoSaga);
}

export default getPowerBIEmbedInfoData;
