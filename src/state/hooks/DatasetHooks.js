// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  dispatchAddDatasetToStore,
  dispatchCreateDataset,
  dispatchDeleteDataset,
  dispatchSetCurrentDatasetIndex,
  dispatchUpdateDataset,
} from '../dispatchers/dataset/DatasetDispatcher';
import { useOrganizationId } from './OrganizationHooks';
import { ResourceUtils } from '@cosmotech/core';

export const useDatasets = () => {
  return useSelector((state) => state.dataset?.list?.data);
};

export const useDatasetsReducerStatus = () => {
  return useSelector((state) => state.dataset.list?.status);
};

export const useSelectedDatasetIndex = () => {
  return useSelector((state) => state.dataset?.selectedDatasetIndex.data);
};

export const useAddDatasetToStore = () => {
  const dispatch = useDispatch();
  return useCallback((payload) => dispatch(dispatchAddDatasetToStore(payload)), [dispatch]);
};

export const useCurrentDataset = () => {
  const datasets = useDatasets();
  const selectedDatasetIndex = useSelectedDatasetIndex();
  return (
    datasets?.[selectedDatasetIndex] ??
    ResourceUtils.getResourceTree(datasets?.filter((dataset) => dataset.main === true))?.[0] ??
    null
  );
};

export const useSelectDataset = () => {
  const datasets = useDatasets();
  const dispatch = useDispatch();

  return useCallback(
    (datasetToSelect) => {
      const selectedDatasetIndex = datasets.findIndex((dataset) => dataset.id === datasetToSelect?.id);
      dispatch(dispatchSetCurrentDatasetIndex(selectedDatasetIndex));
    },
    [datasets, dispatch]
  );
};

export const useDeleteDataset = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  return useCallback(
    (datasetId) => dispatch(dispatchDeleteDataset(organizationId, datasetId)),
    [dispatch, organizationId]
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
  // TODO implement the hook that refreshes dataset data
};

export const useCreateDataset = () => {
  const dispatch = useDispatch();
  const organizationId = useOrganizationId();
  return useCallback((dataset) => dispatch(dispatchCreateDataset(organizationId, dataset)), [dispatch, organizationId]);
};
