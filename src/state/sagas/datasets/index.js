// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, fork } from 'redux-saga/effects';
import { createDatasetSaga } from './CreateDataset';
import { deleteDatasetSaga } from './DeleteDataset';
import { findAllDatasetsData } from './FindAllDatasets';
import { pollTwingraphStatusSaga } from './PollTwingraphStatus';
import { queryDatasetTwingraphSaga } from './QueryDatasetTwingraph';
import { refreshDatasetSaga } from './RefreshDataset';
import { rollbackTwingraphDataSaga } from './RollbackTwingraphData';
import { updateDatasetSaga } from './UpdateDataset';
import { updateDatasetSecuritySaga } from './UpdateDatasetSecurity';

export default function* datasetSaga() {
  yield all([
    fork(findAllDatasetsData),
    fork(deleteDatasetSaga),
    fork(createDatasetSaga),
    fork(updateDatasetSaga),
    fork(updateDatasetSecuritySaga),
    fork(refreshDatasetSaga),
    fork(pollTwingraphStatusSaga),
    fork(queryDatasetTwingraphSaga),
    fork(rollbackTwingraphDataSaga),
  ]);
}
