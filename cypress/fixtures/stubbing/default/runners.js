// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DEFAULT_RUNNER = {
  id: 'R-stbdefault',
  name: 'New Runner',
  description: 'Local file dataset description',
  ownerId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  ownerName: 'Dave Lauper',
  tags: ['Reference', 'Brewery'],
  state: 'Running',
  connector: {
    id: 'c-q1vjg10e5ej',
    name: 'TwincacheConnector 0.4.1',
    version: '0.4.1',
    parametersValues: { TWIN_CACHE_NAME: 't-95j9q5jw17q' },
  },
  fragmentsIds: null,
  validatorId: null,
  compatibility: null,
  creationDate: null,
  lastUpdate: null,
  datasetList: [1],
  parametersValues: [
    {
      parameterId: 'prefix',
      varType: 'string',
      value: '',
    },
  ],
  lastRun: {
    csmSimulationRun: 'ae8d1959-7a71-48ec-9f33-3fae53358cf1',
    runnerRunId: 'SR-V9EYbbOE0',
    workflowId: 'c7cd3f15-8a3b-4bcd-b3ca-62ee24c13d67',
    workflowName: 'workflow-s-dwpxbzmdxn-zkvd7',
  },
  security: {
    default: 'viewer',
    accessControlList: [
      {
        id: 'dave.lauper@cosmotech.com',
        role: 'admin',
      },
    ],
  },
};
