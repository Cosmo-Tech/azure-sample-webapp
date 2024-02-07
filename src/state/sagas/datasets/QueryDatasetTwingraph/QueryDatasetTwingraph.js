// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { all, call, delay, put, select, spawn, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import {
  TWINGRAPH_QUERIES_DELAY,
  TWINGRAPH_QUERY_MAX_RETRIES,
  TWINGRAPH_QUERY_RETRY_DELAY,
} from '../../../../services/config/FunctionalConstants';
import { DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS } from '../../../commons/DatasetConstants';

const getOrganizationId = (state) => state.organization.current?.data?.id;

function* runDatasetTwingraphQuery(action, query, attemptsNumber = 0) {
  const organizationId = yield select(getOrganizationId);
  const { datasetId, workspace } = action.payload;
  const { queriesMapping } = workspace;

  yield put({
    type: DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.WAITING,
    payload: { datasetId, queriesMapping, queryId: query.id },
  });

  let result;
  try {
    result = yield call(Api.Datasets.twingraphQuery, organizationId, datasetId, query);
  } catch (error) {
    const res = error?.response?.data;
    if (res?.status === 400 && attemptsNumber < TWINGRAPH_QUERY_MAX_RETRIES) {
      yield delay(TWINGRAPH_QUERY_RETRY_DELAY);
      return yield call(runDatasetTwingraphQuery, action, query, attemptsNumber + 1);
    }

    console.error(error);
    result = error;
  }

  yield put({
    type: DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.PROCESS,
    payload: { datasetId, queriesMapping, queryId: query.id, result },
  });
}

function* startAllDatasetTwingraphQueries(action) {
  const { workspace } = action.payload;
  const queries = workspace?.webApp?.options?.datasetManager?.queries ?? [];
  yield all(
    queries.map((query, index) => {
      if (index !== 0) delay(TWINGRAPH_QUERIES_DELAY);
      return spawn(runDatasetTwingraphQuery, action, query);
    })
  );
}

function* datasetTwingraphQuerySaga() {
  yield takeEvery(
    [DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.INITIALIZE, DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.RESET],
    startAllDatasetTwingraphQueries
  );
}

export default datasetTwingraphQuerySaga;
