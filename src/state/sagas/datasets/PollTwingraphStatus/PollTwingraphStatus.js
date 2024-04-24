// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, delay, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { INGESTION_STATUS, TWINCACHE_STATUS } from '../../../../services/config/ApiConstants';
import { POLLING_START_DELAY, TWINGRAPH_STATUS_POLLING_DELAY } from '../../../../services/config/FunctionalConstants';
import { DATASET_ACTIONS_KEY, DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getWorkspace = (state) => state.workspace.current?.data;
const getDatasets = (state) => state.dataset?.list?.data ?? [];

export function* pollTwingraphStatus(action) {
  let twingraphStatus = INGESTION_STATUS.PENDING;
  const datasetId = action.datasetId;
  const organizationId = action.organizationId;
  // Polling start is delayed to avoid an erroneous ERROR status due to the fact that, probably, the creation of
  // an AKS container takes time and API returns ERROR while the creation of the twingraph is successful.
  // For more details, see https://cosmo-tech.atlassian.net/browse/SDCOSMO-1768
  yield delay(POLLING_START_DELAY);
  try {
    do {
      const { data: newStatus } = yield call(Api.Datasets.getDatasetTwingraphStatus, organizationId, datasetId);
      if ([INGESTION_STATUS.SUCCESS, INGESTION_STATUS.ERROR, INGESTION_STATUS.UNKNOWN].includes(newStatus)) {
        twingraphStatus = newStatus;
        const datasetData = { ingestionStatus: newStatus };
        if (newStatus === INGESTION_STATUS.SUCCESS) datasetData.twincacheStatus = TWINCACHE_STATUS.FULL;
        yield put({
          type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
          datasetId,
          datasetData,
        });

        if (newStatus === INGESTION_STATUS.SUCCESS) {
          const workspace = yield select(getWorkspace);
          yield put({
            type: DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.RESET,
            payload: { datasetId, workspace },
          });
        }
      } else {
        yield delay(TWINGRAPH_STATUS_POLLING_DELAY);
      }
    } while (![INGESTION_STATUS.SUCCESS, INGESTION_STATUS.ERROR, INGESTION_STATUS.UNKNOWN].includes(twingraphStatus));
  } catch (error) {
    console.error(error);
    const datasets = yield select(getDatasets);
    const targetDataset = datasets.find((dataset) => dataset.id === datasetId);

    let datasetDetails = datasetId;
    if (targetDataset !== undefined && targetDataset.name != null) datasetDetails += `: ${targetDataset.name}`;

    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'commoncomponents.banner.twingraphStatusPollingFailed',
          'A problem occurred when querying the status of dataset {{datasetDetails}}',
          { datasetDetails }
        )
      )
    );
  }
}

function* pollTwingraphStatusSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING, pollTwingraphStatus);
}

export default pollTwingraphStatusSaga;
