// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { all, fork } from 'redux-saga/effects';
import { findAllDatasetsData } from './FindAllDatasets';
import { deleteDatasetSaga } from './DeleteDataset';
import { createDatasetSaga } from './CreateDataset';
import { updateDatasetSaga } from './UpdateDataset';
import { pollTwingraphStatusSaga } from './PollTwingraphStatus';
import { refreshDatasetSaga } from './RefreshDataset';
import { queryDatasetTwingraphSaga } from './QueryDatasetTwingraph';

export default function* datasetSaga() {
  yield all([
    fork(findAllDatasetsData),
    fork(deleteDatasetSaga),
    fork(createDatasetSaga),
    fork(updateDatasetSaga),
    fork(refreshDatasetSaga),
    fork(pollTwingraphStatusSaga),
    fork(queryDatasetTwingraphSaga),
  ]);
}
