// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const TWINGRAPH_QUERIES = [
  {
    id: 'query_entities',
    results: [{ entities: 21 }],
  },
  {
    id: 'query_relationships',
    results: [{ relationships: 42 }],
  },
  {
    id: 'query_productionOperation_KPI',
    results: [{ productionOperation_kpi1: 7 }, { productionOperation_kpi2: 9 }],
  },
  {
    id: 'query_transport_KPI',
    results: [{ transport_kpi1: 3 }, { transport_kpi2: 5 }],
  },
  {
    id: 'query_transports_attributes',
    results: [
      { fields: { name: 'car', source: 'Paris', destination: 'Lyon' } },
      { fields: { name: 'train', source: 'Paris', destination: 'Marseille' } },
      { fields: { name: 'plane', source: 'Paris', destination: 'Nice' } },
      { fields: { name: 'boat', source: 'Paris', destination: 'Bordeaux' } },
    ],
  },
];
