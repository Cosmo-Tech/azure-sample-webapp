// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, call, delay, put, spawn, takeEvery } from 'redux-saga/effects';
import {
  TWINGRAPH_QUERIES_DELAY,
  TWINGRAPH_QUERY_MAX_RETRIES,
  TWINGRAPH_QUERY_RETRY_DELAY,
} from '../../../services/config/FunctionalConstants';
import DatasetService from '../../../services/dataset/DatasetService';
import {
  initializeQueriesResults,
  processQueriesResults,
  resetQueriesResults,
  waitQueryResults,
} from '../../datasetTwingraph/reducers';

function* runDatasetTwingraphQuery(action, query, attemptsNumber = 0) {
  const { dataset, workspace } = action.payload;
  const { kpiIdsByQueryId } = workspace;
  const { organizationId, workspaceId, id: datasetId } = dataset;

  yield put(waitQueryResults({ datasetId, kpiIdsByQueryId, queryId: query.id }));

  const queryDatasetPartName = query.datasetPartName;
  const datasetPartId = (dataset?.parts ?? []).find((part) => part.name === queryDatasetPartName)?.id;
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
    if (res?.status === 400 && attemptsNumber < TWINGRAPH_QUERY_MAX_RETRIES) {
      yield delay(TWINGRAPH_QUERY_RETRY_DELAY);
      return yield call(runDatasetTwingraphQuery, action, query, attemptsNumber + 1);
    }

    console.error(error);
    result = error;
  }

  yield put(processQueriesResults({ datasetId, kpiIdsByQueryId, queryId: query.id, result }));
}

function* startAllDatasetTwingraphQueries(action) {
  const { workspace } = action.payload;
  const queries = workspace?.additionalData?.webapp?.datasetManager?.queries ?? [];
  const graphIndicators = workspace?.additionalData?.webapp?.datasetManager?.graphIndicators;
  const categories = workspace?.additionalData?.webapp?.datasetManager?.categories;

  yield all(
    queries.map((query, index) => {
      if (
        !categories?.some((category) => (category?.kpis ?? [])?.some((kpi) => kpi?.queryId === query.id)) &&
        !graphIndicators?.some((indicator) => indicator?.queryId === query.id)
      )
        return null;
      if (index !== 0) delay(TWINGRAPH_QUERIES_DELAY);
      return spawn(runDatasetTwingraphQuery, action, query);
    })
  );
}

function* datasetTwingraphQuerySaga() {
  yield takeEvery([initializeQueriesResults, resetQueriesResults], startAllDatasetTwingraphQueries);
}

export default datasetTwingraphQuerySaga;
