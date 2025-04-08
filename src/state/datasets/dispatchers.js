// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DATASET_ACTIONS_KEY } from './constants';

export const dispatchDeleteDataset = (organizationId, datasetId, selectedDatasetId) => ({
  type: DATASET_ACTIONS_KEY.DELETE_DATASET,
  organizationId,
  datasetId,
  selectedDatasetId,
});

export const dispatchCreateDataset = (organizationId, dataset) => ({
  type: DATASET_ACTIONS_KEY.CREATE_DATASET,
  organizationId,
  dataset,
});

export const dispatchRefreshDataset = (organizationId, datasetId) => ({
  type: DATASET_ACTIONS_KEY.REFRESH_DATASET,
  organizationId,
  datasetId,
});

export const dispatchUpdateDataset = (organizationId, datasetId, datasetData, datasetIndex) => ({
  type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
  organizationId,
  datasetId,
  datasetData,
  datasetIndex,
});

export const dispatchRollbackTwingraphData = (organizationId, datasetId) => ({
  type: DATASET_ACTIONS_KEY.ROLLBACK_TWINGRAPH_DATA,
  organizationId,
  datasetId,
});

export const dispatchPollTwingraphStatus = (organizationId, datasetId) => ({
  type: DATASET_ACTIONS_KEY.START_TWINGRAPH_STATUS_POLLING,
  organizationId,
  datasetId,
});

export const dispatchUpdateDatasetSecurity = (datasetId, datasetSecurity) => ({
  type: DATASET_ACTIONS_KEY.UPDATE_DATASET_SECURITY,
  datasetId,
  datasetSecurity,
});
