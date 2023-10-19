// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dispatchAddDatasetToStore } from '../dispatchers/dataset/DatasetDispatcher';

export const useDatasetList = () => {
  return useSelector((state) => state.dataset.list);
};

export const useDatasetListData = () => {
  return useSelector((state) => state.dataset?.list?.data);
};

export const useAddDatasetToStore = () => {
  const dispatch = useDispatch();
  return useCallback((payLoad) => dispatch(dispatchAddDatasetToStore(payLoad)), [dispatch]);
};

export const useCurrentDataset = () => {
  // TODO implement the hook with real data
  return {
    creationDate: 1697444488457,
    description: 'El pueblo unido jamas sara vencido',
    fragmentsIds: null,
    id: 'd-65rkx9r8ym2',
    main: true,
    name: 'Dataset 4',
    organizationId: 'O-gZYpnd27G7',
    ownerId: '848be2c3-a28d-42f9-af18-89343426315b',
    parentId: 'd-65rkx9r8ym5',
    queries: ['MATCH (n:Users) return n'],
    refreshDate: 1697443823284,
    security: null,
    source: {
      location: 'o-gzypnd27g7',
      name: 'csmphoenixdev',
      path: 'w-81264wr3xw5q5/demobrewery',
    },
    sourceType: 'Twincache',
    status: 'READY',
    tags: ['storage', 'file'],
    twingraphId: 't-nyzr704dmor',
    validatorId: null,
  };
};

export const useSelectDataset = () => {
  // TODO implement the hook that sets new currentDataset
};

export const useDeleteDataset = () => {
  // TODO implement the hook that deletes specific dataset and its children
};

export const useRefreshDataset = () => {
  // TODO implement the hook that refreshes dataset data
};
