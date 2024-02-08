// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* rollbackTwingraphData(action) {
  try {
    const organizationId = action.organizationId;
    const datasetId = action.datasetId;
    yield call(Api.Datasets.rollbackRefresh, organizationId, datasetId);

    yield put({
      type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
      datasetId,
      datasetData: { ingestionStatus: INGESTION_STATUS.SUCCESS },
    });
  } catch (error) {
    console.error(error);
    dispatchSetApplicationErrorMessage(
      error,
      t('commoncomponents.banner.twingraphDataNotRestored', "Twingraph data hasn't been restored")
    );
  }
}

function* rollbackTwingraphDataSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.TRIGGER_SAGA_ROLLBACK_TWINGRAPH_DATA, rollbackTwingraphData);
}

export default rollbackTwingraphDataSaga;
