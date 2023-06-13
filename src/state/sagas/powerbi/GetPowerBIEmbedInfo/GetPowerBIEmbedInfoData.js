// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { delay, put, takeEvery } from 'redux-saga/effects';
import { POWER_BI_ACTIONS_KEY } from '../../../commons/PowerBIConstants';
import { STATUSES } from '../../../commons/Constants';
import { USE_POWER_BI_WITH_USER_CREDENTIALS } from '../../../../config/PowerBI';
import { POWER_BI_INFO_POLLING_DELAY } from '../../../../services/config/FunctionalConstants';
import { PowerBIService } from '../../../../services/powerbi/PowerBIService';

const IS_POWERBI_POLLING_DISABLED = !!process.env.REACT_APP_NO_POWERBI_POLLING;
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
        const response = yield PowerBIService.getPowerBIDataWithServiceAccount();
        accesses = response?.accesses;
        error = response?.error;
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
