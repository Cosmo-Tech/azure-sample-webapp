// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_WORKSPACE } from '../default';

export const WORKSPACE_WITHOUT_CONFIG = {
  ...DEFAULT_WORKSPACE,
  id: 'W-stbbdbrwryNoDM',
  name: 'Stubbed Demo Brewery Workspace without Dataset Manager config',
  webApp: {
    options: {
      ...DEFAULT_WORKSPACE.webApp.options,
    },
  },
};

export const WORKSPACE = {
  ...DEFAULT_WORKSPACE,
  id: 'W-stbbdbrwryWithDM',
  name: 'Stubbed Demo Brewery Workspace with Dataset Manager config',
  linkedDatasetIdList: [],
};

WORKSPACE.webApp.options.datasetManager = {
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
