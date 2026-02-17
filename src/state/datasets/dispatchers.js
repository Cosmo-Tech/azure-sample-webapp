// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DATASET_ACTIONS_KEY } from './constants';

export const dispatchGetDataset = (organizationId, workspaceId, datasetId) => ({
  type: DATASET_ACTIONS_KEY.GET_DATASET,
  organizationId,
  workspaceId,
  datasetId,
});

export const dispatchDeleteDataset = (organizationId, datasetId, selectedDatasetId) => ({
  type: DATASET_ACTIONS_KEY.DELETE_DATASET,
  organizationId,
  datasetId,
  selectedDatasetId,
});

export const dispatchCreateDataset = (dataset, files, shouldSelectDataset) => ({
  type: DATASET_ACTIONS_KEY.CREATE_DATASET,
  dataset,
  files,
  shouldSelectDataset,
});

export const dispatchRefreshDataset = (organizationId, dataset) => ({
  type: DATASET_ACTIONS_KEY.REFRESH_DATASET,
  organizationId,
  dataset,
});

export const dispatchUpdateDataset = (organizationId, datasetId, datasetData, datasetIndex) => ({
  type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
  organizationId,
  datasetId,
  datasetData,
  datasetIndex,
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
