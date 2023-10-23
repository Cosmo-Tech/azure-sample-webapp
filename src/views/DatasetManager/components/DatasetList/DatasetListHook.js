// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// import { useDatasetListData } from '../../../../../state/hooks/DatasetHooks';

import { ResourceUtils } from '@cosmotech/core';
import {
  useCurrentDataset,
  useDeleteDataset,
  useRefreshDataset,
  useSelectDataset,
} from '../../../../state/hooks/DatasetHooks';

export const useDatasetList = () => {
  // TODO: use the hook when it will be adapted to v3
  // const datasetList = useDatasetListData();
  const datasetList = [
    {
      creationDate: 1697444488457,
      description: 'El pueblo unido jamas sara vencido',
      fragmentsIds: null,
      id: 'd-65rkx9r8ym7',
      main: true,
      name: 'Dataset 1',
      organizationId: 'O-gZYpnd27G7',
      ownerId: '848be2c3-a28d-42f9-af18-89343426315b',
      parentId: null,
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
    },
    {
      creationDate: 1697444488457,
      description: 'El pueblo unido jamas sara vencido',
      fragmentsIds: null,
      id: 'd-65rkx9r8ym6',
      main: true,
      name: 'Dataset 2',
      organizationId: 'O-gZYpnd27G7',
      ownerId: '848be2c3-a28d-42f9-af18-89343426315b',
      parentId: 'd-65rkx9r8ym7',
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
    },
    {
      creationDate: 1697444488457,
      description: 'El pueblo unido jamas sara vencido',
      fragmentsIds: null,
      id: 'd-65rkx9r8ym5',
      main: true,
      name: 'Dataset 3',
      organizationId: 'O-gZYpnd27G7',
      ownerId: '848be2c3-a28d-42f9-af18-89343426315b',
      parentId: null,
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
    },
    {
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
    },
    {
      creationDate: 1697444488457,
      description: 'El pueblo unido jamas sara vencido',
      fragmentsIds: null,
      id: 'd-65rkx9r8ym9',
      main: true,
      name: 'Dataset 5',
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
    },
    {
      creationDate: 1697444488457,
      description: 'El pueblo unido jamas sara vencido',
      fragmentsIds: null,
      id: 'd-65rkx9r8ym3',
      main: true,
      name: 'Dataset 6',
      organizationId: 'O-gZYpnd27G7',
      ownerId: '848be2c3-a28d-42f9-af18-89343426315b',
      parentId: 'd-65rkx9r8ym9',
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
    },
  ];
  const sortedDatasetList = ResourceUtils.getResourceTree(datasetList);
  const currentDataset = useCurrentDataset();
  const selectDataset = useSelectDataset();
  const deleteDataset = useDeleteDataset();
  const refreshDatasetById = useRefreshDataset();
  return { sortedDatasetList, currentDataset, selectDataset, deleteDataset, refreshDatasetById };
};
