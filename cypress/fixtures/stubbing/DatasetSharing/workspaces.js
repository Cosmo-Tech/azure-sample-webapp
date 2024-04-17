// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_WORKSPACE, USERS_LIST } from '../default';

export const WORKSPACE_WITH_DATASET_MANAGER = {
  ...DEFAULT_WORKSPACE,
  linkedDatasetIdList: ['d-privateDts_1'],
};

WORKSPACE_WITH_DATASET_MANAGER.webApp.options.datasetManager = {
  queries: [],
  graphIndicators: [
    { id: 'entities', name: { en: 'Entities', fr: 'Entités' } },
    { id: 'relationships', name: { en: 'Relationships', fr: 'Relations' } },
  ],
  categories: [
    {
      id: 'transport',
      type: 'relationship',
      description: {
        en: 'Transport category description',
        fr: 'Description de la catégorie de transport',
      },
      kpis: [
        { id: 'transport_kpi1', name: { en: 'My KPI #1', fr: 'Mon KPI n°1' } },
        { id: 'transport_kpi2', name: { en: 'My KPI #2', fr: 'Mon KPI n°2' } },
      ],
      attributes: ['Name', 'Source', 'Destination'],
    },
    {
      id: 'productionOperation',
      name: { en: 'Production operation', fr: 'Opération de production' },
      type: 'relationship',
      kpis: [{ id: 'productionOperation_kpi1' }, { id: 'productionOperation_kpi2' }],
    },
  ],
};

const usersAccess = [
  { id: USERS_LIST[0].email, role: ROLES.SCENARIO.ADMIN },
  { id: USERS_LIST[1].email, role: ROLES.SCENARIO.VIEWER },
  { id: USERS_LIST[2].email, role: ROLES.SCENARIO.EDITOR },
  { id: USERS_LIST[3].email, role: ROLES.SCENARIO.ADMIN },
];

export const WORKSPACE_WITH_USERS_LIST = {
  ...WORKSPACE_WITH_DATASET_MANAGER,
  key: 'BreweryForDataset',
  security: {
    default: 'none',
    accessControlList: usersAccess,
  },
  id: 'W-stbbdbrwFDts',
  name: 'Stubbed Demo Brewery Workspace with Dataset Manager config',
};
