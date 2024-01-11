// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { Api } from '../../../../services/config/Api';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { STATUSES } from '../../../commons/Constants';

export function* fetchAllDatasetsData(organizationId) {
  const { data } = yield call(Api.Datasets.findAllDatasets, organizationId);

  yield put({
    type: DATASET_ACTIONS_KEY.SET_ALL_DATASETS,
    list: data,
    status: STATUSES.SUCCESS,
  });

  if (data?.length > 0) {
    yield put({
      type: DATASET_ACTIONS_KEY.SET_CURRENT_DATASET_INDEX,
      selectedDatasetId: null,
    });
    const datasetsToUpdate = data.filter(
      (dataset) => dataset.main === true && dataset.ingestionStatus === INGESTION_STATUS.PENDING
    );

    for (const dataset of datasetsToUpdate) {
      yield put({
        type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING,
        datasetId: dataset.id,
        organizationId,
      });
    }
  }
}

function* findAllDatasetsData() {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, fetchAllDatasetsData);
}

export default findAllDatasetsData;
