// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// import { useCurrentDataset } from '../../../../state/hooks/DatasetHooks';

export const useDatasetMetadata = () => {
  // const dataset = useCurrentDataset();

  // TODO: replace hard-coded JSON below by "current dataset" from redux when available
  const dataset = {
    id: 'd-x10pzpjev43',
    name: 'Brewery Aixo Mateix',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ' +
      'magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
      'commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat ' +
      'nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit ' +
      'anim id est laborum.',
    ownerId: '848be2c3-a28d-42f9-af18-89343426315b',
    organizationId: 'O-gZYpnd27G7',
    parentId: null,
    twingraphId: 't-pyz9lgymrzy',
    main: true,
    creationDate: 1697443391520,
    refreshDate: null,
    sourceType: 'None',
    source: null,
    status: 'DRAFT',
    queries: null,
    tags: ['None', 'Brewery', 'Reference'],
    connector: {
      id: 'c-wdeg4orler5',
      name: 'TwincacheConnector 0.4.1',
      version: '0.4.1',
      parametersValues: { TWIN_CACHE_NAME: 't-pyz9lgymrzy' },
    },
    fragmentsIds: null,
    validatorId: null,
    compatibility: null,
    security: null,
  };

  return { dataset };
};
