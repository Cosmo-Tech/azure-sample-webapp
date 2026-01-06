// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DEFAULT_DATASET = {
  organizationId: 'O-stbdorgztn',
  parentId: null,
  twingraphId: 't-stbdtwngrph',
  additionalData: { webapp: {} },
  id: 'D-stbdefault',
  name: 'Local file dataset',
  description: 'Local file dataset description',
  ownerId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  ownerName: 'Dave Lauper',
  createInfo: { timestamp: 1714487051204, userId: 'dev.sample.webapp@example.com' },
  updateInfo: { timestamp: 1714487051204, userId: 'dev.sample.webapp@example.com' },
  tags: ['File', 'Brewery'],
  sourceType: 'File',
  source: { location: 'none', name: null, path: null, jobId: null },
  status: 'READY',
  connector: {
    id: 'c-q1vjg10e5ej',
    name: 'TwincacheConnector 0.4.1',
    version: '0.4.1',
    parametersValues: { TWIN_CACHE_NAME: 't-95j9q5jw17q' },
  },
  fragmentsIds: null,
  validatorId: null,
  compatibility: null,
  queries: null,
  security: {default: "admin", accessControlList: []},
};

export const MAIN_DATASET = {...DEFAULT_DATASET,
  id: 'D-stbdMainDataset',
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
};

export const RUNNER_BASE_DATASET = {
  ...DEFAULT_DATASET,
  id: 'D-stbdBaseDataset',
  name: 'Runner base dataset',
};

export const DEFAULT_DATASETS_LIST = [DEFAULT_DATASET, MAIN_DATASET, RUNNER_BASE_DATASET];
