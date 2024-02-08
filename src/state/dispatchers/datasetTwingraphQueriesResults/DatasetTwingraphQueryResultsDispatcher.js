// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS } from '../../commons/DatasetConstants';

export const dispatchInitializeDatasetTwingraphQueriesResults = (datasetId, workspace) => ({
  type: DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.INITIALIZE,
  payload: { datasetId, workspace },
});

export const dispatchResetDatasetTwingraphQueriesResults = (datasetId, workspace) => ({
  type: DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS.RESET,
  payload: { datasetId, workspace },
});
