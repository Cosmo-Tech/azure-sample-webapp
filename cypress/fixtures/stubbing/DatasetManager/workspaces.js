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
  graphIndicators: [
    { id: 'entities', name: { en: 'Entities', fr: 'Entités' }, queryId: 'query_entities' },
    { id: 'relationships', name: { en: 'Relationships', fr: 'Relations' }, queryId: 'query_relationships' },
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
        { id: 'transport_kpi1', name: { en: 'My KPI #1', fr: 'Mon KPI n°1' }, queryId: 'query_transport_KPI' },
        { id: 'transport_kpi2', name: { en: 'My KPI #2', fr: 'Mon KPI n°2' }, queryId: 'query_transport_KPI' },
      ],
      attributes: ['Name', 'Source', 'Destination'],
      previewTable: {
        columns: [
          {
            field: 'name',
            headerName: 'Name',
            type: ['string'],
          },
          {
            field: 'source',
            headerName: 'Source',
            type: ['string'],
          },
          {
            field: 'destination',
            headerName: 'Destination',
            type: ['string'],
          },
        ],
        queryId: 'query_transports_attributes',
        resultKey: 'fields',
      },
    },
    {
      id: 'productionOperation',
      name: { en: 'Production operation', fr: 'Opération de production' },
      type: 'relationship',
      kpis: [
        { id: 'productionOperation_kpi1', queryId: 'query_productionOperation_KPI' },
        { id: 'productionOperation_kpi2', queryId: 'query_productionOperation_KPI' },
      ],
    },
  ],
  queries: [
    {
      id: 'query_entities',
      query: 'MATCH entities',
    },
    {
      id: 'query_relationships',
      query: 'MATCH relationships',
    },
    {
      id: 'query_transport_KPI',
      query: 'MATCH KPI',
    },
    {
      id: 'query_transports_attributes',
      query: 'MATCH transports_attributes',
    },
    {
      id: 'query_productionOperation_KPI',
      query: 'MATCH productionOperation_KPI',
    },
  ],
};
