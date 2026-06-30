// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, call, delay, put, spawn, takeEvery } from 'redux-saga/effects';
import {
  DATASET_QUERY_DELAY,
  DATASET_QUERY_MAX_RETRIES,
  DATASET_QUERY_RETRY_DELAY,
} from '../../../services/config/FunctionalConstants';
import DatasetService from '../../../services/dataset/DatasetService';
import {
  initializeQueriesResults,
  processQueriesResults,
  resetQueriesResults,
  waitQueryResults,
} from '../../datasetQuery/reducers';

function* runDatasetQuery(action, query, attemptsNumber = 0) {
  const { dataset, workspace } = action.payload;
  const { kpiIdsByQueryId } = workspace;
  const { organizationId, workspaceId, id: datasetId } = dataset;

  yield put(waitQueryResults({ datasetId, kpiIdsByQueryId, queryId: query.id }));

  const queryDatasetPartName = query.datasetPartName;
  const datasetPartId = (dataset?.parts ?? []).find(
    (part) => part.name === queryDatasetPartName && part.type === 'DB'
  )?.id;
  if (datasetPartId == null)
    throw Error(
      `No dataset part with name "${queryDatasetPartName}" found in dataset "${dataset.name}" (${dataset.id})`
    );

  const datasetPart = { organizationId, workspaceId, datasetId, id: datasetPartId };
  let result;
  try {
    const queryOptions = query.options ?? {};
    result = yield call(DatasetService.queryDatasetPart, datasetPart, queryOptions);
  } catch (error) {
    const res = error?.response?.data;
    if (res?.status === 400 && attemptsNumber < DATASET_QUERY_MAX_RETRIES) {
      yield delay(DATASET_QUERY_RETRY_DELAY);
      return yield call(runDatasetQuery, action, query, attemptsNumber + 1);
    }

    console.error(error);
    result = error;
  }

  yield put(processQueriesResults({ datasetId, kpiIdsByQueryId, queryId: query.id, result }));
}

function* startAllDatasetQueries(action) {
  const { workspace } = action.payload;
  const queries = workspace?.additionalData?.webapp?.datasetManager?.queries ?? [];
  const kpiCards = workspace?.additionalData?.webapp?.datasetManager?.kpiCards;
  const categories = workspace?.additionalData?.webapp?.datasetManager?.categories;

  yield all(
    queries.map((query, index) => {
      if (
        !categories?.some((category) => (category?.kpis ?? [])?.some((kpi) => kpi?.queryId === query.id)) &&
        !kpiCards?.some((indicator) => indicator?.queryId === query.id)
      )
        return null;
      if (index !== 0) delay(DATASET_QUERY_DELAY);
      return spawn(runDatasetQuery, action, query);
    })
  );
}

function* datasetQuerySaga() {
  yield takeEvery([initializeQueriesResults, resetQueriesResults], startAllDatasetQueries);
}

export default datasetQuerySaga;
