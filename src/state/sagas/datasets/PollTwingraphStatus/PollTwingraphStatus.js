// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery, delay } from 'redux-saga/effects';
import { t } from 'i18next';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { TWINGRAPH_STATUS } from '../../../../services/config/ApiConstants';
import { TWINGRAPH_STATUS_POLLING_DELAY } from '../../../../services/config/FunctionalConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* pollTwingraphStatus(action) {
  let twingraphStatus = TWINGRAPH_STATUS.PENDING;
  const datasetId = action.datasetId;
  const organizationId = action.organizationId;

  try {
    do {
      const { data: newStatus } = yield call(Api.Datasets.getDatasetTwingraphStatus, organizationId, datasetId);
      if ([TWINGRAPH_STATUS.READY, TWINGRAPH_STATUS.ERROR, TWINGRAPH_STATUS.UNKNOWN].includes(newStatus)) {
        twingraphStatus = newStatus;
        yield put({
          type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
          datasetId,
          datasetData: { status: newStatus },
        });
      } else {
        yield delay(TWINGRAPH_STATUS_POLLING_DELAY);
      }
    } while (![TWINGRAPH_STATUS.READY, TWINGRAPH_STATUS.ERROR, TWINGRAPH_STATUS.UNKNOWN].includes(twingraphStatus));
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.twingraphNotCreated', 'A problem occurred during twingraph creation')
      )
    );
  }
}

function* pollTwingraphStatusSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING, pollTwingraphStatus);
}

export default pollTwingraphStatusSaga;
