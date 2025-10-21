// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { put, takeEvery } from 'redux-saga/effects';
import { INGESTION_STATUS } from '../../../services/config/ApiConstants';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_ACTIONS_KEY } from '../constants';
import { updateDataset } from '../reducers';

export function* rollbackTwingraphData(action) {
  try {
    const datasetId = action.datasetId;
    // const organizationId = action.organizationId;
    // FIXME: refresh dataset no longer exist, remove this feature
    // yield call(Api.Datasets.rollbackRefresh, organizationId, datasetId);

    yield put(updateDataset({ datasetId, datasetData: { ingestionStatus: INGESTION_STATUS.SUCCESS } }));
  } catch (error) {
    console.error(error);
    setApplicationErrorMessage({
      error,
      errorMessage: t('commoncomponents.banner.twingraphDataNotRestored', "Twingraph data hasn't been restored"),
    });
  }
}

function* rollbackTwingraphDataSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.ROLLBACK_TWINGRAPH_DATA, rollbackTwingraphData);
}

export default rollbackTwingraphDataSaga;
