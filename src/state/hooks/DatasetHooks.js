// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  dispatchAddDatasetToStore,
  dispatchCreateDataset,
  dispatchDeleteDataset,
  dispatchPollTwingraphStatus,
  dispatchRefreshDataset,
  dispatchRollbackTwingraphData,
  dispatchSelectDatasetById,
  dispatchUpdateDataset,
  dispatchUpdateDatasetInStore,
} from '../dispatchers/dataset/DatasetDispatcher';
import { useOrganizationId } from './OrganizationHooks';

export const useDatasets = () => {
  return useSelector((state) => state.dataset?.list?.data);
};

export const useDatasetsReducerStatus = () => {
  return useSelector((state) => state.dataset.list?.status);
};

export const useSelectedDatasetIndex = () => {
  return useSelector((state) => state.dataset?.selectedDatasetIndex);
};

export const useAddDatasetToStore = () => {
  const dispatch = useDispatch();
  return useCallback((payload) => dispatch(dispatchAddDatasetToStore(payload)), [dispatch]);
};

export const useCurrentDataset = () => {
  const datasets = useDatasets();
  const selectedDatasetIndex = useSelectedDatasetIndex();
  return datasets?.[selectedDatasetIndex] ?? null;
};

export const useCurrentDatasetId = () => {
  const currentDataset = useCurrentDataset();
  return currentDataset?.id;
};

export const useSelectDataset = () => {
  const dispatch = useDispatch();

  return useCallback(
    (datasetToSelect) => {
      dispatch(dispatchSelectDatasetById(datasetToSelect?.id));
    },
    [dispatch]
  );
};

export const useDeleteDataset = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  const selectedDatasetId = useCurrentDatasetId();
  return useCallback(
    (datasetId) => dispatch(dispatchDeleteDataset(organizationId, datasetId, selectedDatasetId)),
    [dispatch, organizationId, selectedDatasetId]
  );
};

export const useUpdateDataset = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  return useCallback(
    (datasetId, datasetData, datasetIndex) =>
      dispatch(dispatchUpdateDataset(organizationId, datasetId, datasetData, datasetIndex)),
    [dispatch, organizationId]
  );
};

export const useRefreshDataset = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  return useCallback(
    (datasetId) => dispatch(dispatchRefreshDataset(organizationId, datasetId)),
    [dispatch, organizationId]
  );
};

export const useCreateDataset = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  return useCallback((dataset) => dispatch(dispatchCreateDataset(organizationId, dataset)), [dispatch, organizationId]);
};

export const useRollbackTwingraphData = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  return useCallback(
    (datasetId) => dispatch(dispatchRollbackTwingraphData(organizationId, datasetId)),
    [dispatch, organizationId]
  );
};

export const usePollTwingraphStatus = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  return useCallback(
    (datasetId) => dispatch(dispatchPollTwingraphStatus(organizationId, datasetId)),
    [dispatch, organizationId]
  );
};

export const useUpdateDatasetInStore = () => {
  const dispatch = useDispatch();
  return useCallback(
    (datasetId, datasetData, datasetIndex = undefined) =>
      dispatch(dispatchUpdateDatasetInStore(datasetId, datasetData, datasetIndex)),
    [dispatch]
  );
};
