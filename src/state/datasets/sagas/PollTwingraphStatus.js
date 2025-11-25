// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { delay, put, select, takeEvery } from 'redux-saga/effects';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import { POLLING_START_DELAY, TWINGRAPH_STATUS_POLLING_DELAY } from '../../../services/config/FunctionalConstants';
import { setApplicationErrorMessage } from '../../app/reducers';
import { resetQueriesResults } from '../../datasetTwingraph/reducers';
import { DATASET_ACTIONS_KEY } from '../constants';
import { updateDataset } from '../reducers';

const getWorkspace = (state) => state.workspace.current?.data;
const getDatasets = (state) => state.dataset?.list?.data ?? [];

const isStillRunning = (status) =>
  [RUNNER_RUN_STATE.SUCCESSFUL, RUNNER_RUN_STATE.FAILED, RUNNER_RUN_STATE.UNKNOWN].includes(status);

export function* pollTwingraphStatus(action) {
  const workspace = yield select(getWorkspace);

  let twingraphStatus = RUNNER_RUN_STATE.RUNNING;
  const datasetId = action.datasetId;
  // const organizationId = action.organizationId;
  // Polling start is delayed to avoid an erroneous ERROR status due to the fact that, probably, the creation of
  // an AKS container takes time and API returns ERROR while the creation of the twingraph is successful.
  // For more details, see https://cosmo-tech.atlassian.net/browse/SDCOSMO-1768
  yield delay(POLLING_START_DELAY);
  try {
    do {
      // FIXME: twingraphs no longer exist, replace by new dataset query mechanism
      const newStatus = RUNNER_RUN_STATE.FAILED;
      // const { data: newStatus } = yield call(Api.Datasets.getDatasetTwingraphStatus, organizationId, datasetId);

      if (isStillRunning(newStatus)) {
        twingraphStatus = newStatus;
        yield put(updateDataset({ datasetId, datasetData: { ingestionStatus: newStatus } }));

        if (newStatus === RUNNER_RUN_STATE.SUCCESSFUL) {
          yield put(resetQueriesResults({ datasetId, workspace }));
        }
      } else {
        yield delay(TWINGRAPH_STATUS_POLLING_DELAY);
      }
    } while (!isStillRunning(twingraphStatus));
  } catch (error) {
    console.error(error);
    const datasets = yield select(getDatasets);
    const targetDataset = datasets.find((dataset) => dataset.id === datasetId);

    let datasetDetails = datasetId;
    if (targetDataset !== undefined && targetDataset.name != null) datasetDetails += `: ${targetDataset.name}`;

    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t(
          'commoncomponents.banner.twingraphStatusPollingFailed',
          'A problem occurred when querying the status of dataset {{datasetDetails}}',
          {
            datasetDetails,
          }
        ),
      })
    );
  }
}

function* pollTwingraphStatusSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.START_TWINGRAPH_STATUS_POLLING, pollTwingraphStatus);
}

export default pollTwingraphStatusSaga;
