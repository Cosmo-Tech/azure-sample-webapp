// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DEFAULT_DATASET = {
  organizationId: 'O-stbdorgztn',
  parentId: null,
  twingraphId: 't-stbdtwngrph',
  main: false,
  id: 'D-stbdefault',
  name: 'Local file dataset',
  description: 'Local file dataset description',
  ownerId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  ownerName: 'Dave Lauper',
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
  creationDate: null,
  refreshDate: null,
  queries: null,
  security: null,
};

export const DEFAULT_DATASETS_LIST = [DEFAULT_DATASET];
