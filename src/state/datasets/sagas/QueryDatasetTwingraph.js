// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, call, delay, put, spawn, takeEvery } from 'redux-saga/effects';
import {
  TWINGRAPH_QUERIES_DELAY,
  TWINGRAPH_QUERY_MAX_RETRIES,
  TWINGRAPH_QUERY_RETRY_DELAY,
} from '../../../services/config/FunctionalConstants';
import {
  initializeQueriesResults,
  processQueriesResults,
  resetQueriesResults,
  waitQueriesResults,
} from '../../datasetTwingraph/reducers';

function* runDatasetTwingraphQuery(action, query, attemptsNumber = 0) {
  const { datasetId, workspace } = action.payload;
  const { queriesMapping } = workspace;

  yield put(waitQueriesResults({ datasetId, queriesMapping, queryId: query.id }));

  let result;
  try {
    // FIXME: twingraphs no longer exist, replace by new dataset query mechanism
    // result = yield call(Api.Datasets.twingraphQuery, organizationId, datasetId, query);
    result = {};
  } catch (error) {
    const res = error?.response?.data;
    if (res?.status === 400 && attemptsNumber < TWINGRAPH_QUERY_MAX_RETRIES) {
      yield delay(TWINGRAPH_QUERY_RETRY_DELAY);
      return yield call(runDatasetTwingraphQuery, action, query, attemptsNumber + 1);
    }

    console.error(error);
    result = error;
  }

  yield put(processQueriesResults({ datasetId, queriesMapping, queryId: query.id, result }));
}

function* startAllDatasetTwingraphQueries(action) {
  const { workspace } = action.payload;
  const queries = workspace?.webApp?.options?.datasetManager?.queries ?? [];
  const graphIndicators = workspace?.webApp?.options?.datasetManager?.graphIndicators;
  const categories = workspace?.webApp?.options?.datasetManager?.categories;

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
