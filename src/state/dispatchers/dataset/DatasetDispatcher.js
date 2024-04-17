// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DATASET_ACTIONS_KEY } from '../../commons/DatasetConstants';

export const dispatchGetAllDatasets = (payLoad) => ({
  type: DATASET_ACTIONS_KEY.GET_ALL_DATASETS,
  ...payLoad,
});

export const dispatchAddDatasetToStore = (payLoad) => ({
  type: DATASET_ACTIONS_KEY.ADD_DATASET,
  ...payLoad,
});

export const dispatchSelectDatasetById = (datasetId) => ({
  type: DATASET_ACTIONS_KEY.SELECT_DATASET,
  selectedDatasetId: datasetId,
});

export const dispatchSelectDefaultDataset = (selectableDatasets) => ({
  type: DATASET_ACTIONS_KEY.SELECT_DEFAULT_DATASET,
  selectableDatasets,
});

export const dispatchDeleteDataset = (organizationId, datasetId, selectedDatasetId) => ({
  type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_DELETE_DATASET,
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
  type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_REFRESH_DATASET,
  organizationId,
  datasetId,
});

export const dispatchUpdateDataset = (organizationId, datasetId, datasetData, datasetIndex) => ({
  type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_DATASET,
  organizationId,
  datasetId,
  datasetData,
  datasetIndex,
});

export const dispatchUpdateDatasetInStore = (datasetId, datasetData, datasetIndex) => ({
  type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
  datasetId,
  datasetData,
  datasetIndex,
});

export const dispatchRollbackTwingraphData = (organizationId, datasetId) => ({
  type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_ROLLBACK_TWINGRAPH_DATA,
  organizationId,
  datasetId,
});

export const dispatchPollTwingraphStatus = (organizationId, datasetId) => ({
  type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING,
  organizationId,
  datasetId,
});

export const dispatchUpdateDatasetSecurity = (datasetId, datasetSecurity) => ({
  type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_DATASET_SECURITY,
  datasetId,
  datasetSecurity,
});
