// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_WORKSPACE } from '../default';

export const WORKSPACE_WITHOUT_CONFIG = {
  ...DEFAULT_WORKSPACE,
  id: 'W-stbbdbrwryNoDM',
  name: 'Stubbed Demo Brewery Workspace without Dataset Manager config',
  additionalData: {
    webapp: { ...DEFAULT_WORKSPACE.additionalData.webapp },
  },
};

export const WORKSPACE = {
  ...DEFAULT_WORKSPACE,
  id: 'W-stbbdbrwryWithDM',
  name: 'Stubbed Demo Brewery Workspace with Dataset Manager config',
};

WORKSPACE.additionalData.webapp.datasetManager = {
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
      datasetPartName: 'entities',
      options: { counts: 'Name' },
    },
    {
      id: 'query_relationships',
      datasetPartName: 'relationships',
      options: { counts: 'Name' },
    },
    {
      id: 'query_transport_KPI',
      datasetPartName: 'KPI',
      options: { selects: 'transport_kpi1,transport_kpi2' },
    },
    {
      id: 'query_transports_attributes',
      datasetPartName: 'transports_attributes',
    },
    {
      id: 'query_productionOperation_KPI',
      datasetPartName: 'productionOperation_KPI',
      options: { selects: 'productionOperation_kpi1,productionOperation_kpi2' },
    },
  ],
};
