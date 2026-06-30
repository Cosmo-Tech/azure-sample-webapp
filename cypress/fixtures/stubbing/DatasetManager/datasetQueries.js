// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DATASET_A_KPI_QUERIES = [
  {
    datasetPartId: 'dp-entities',
    decodedResponse: 'entities\n21',
  },
  {
    datasetPartId: 'dp-relationships',
    decodedResponse: 'relationships\n42',
  },
  {
    datasetPartId: 'dp-productionOperation_KPI',
    decodedResponse: 'productionOperation_kpi1,productionOperation_kpi2\n7,9',
  },
  {
    datasetPartId: 'dp-transport_KPI',
    decodedResponse: 'transport_kpi1,transport_kpi2\n3,5',
  },
];

export const DATASET_B_KPI_QUERIES = [
  {
    datasetPartId: 'dp-entitiesB',
    decodedResponse: 'entities\n21',
  },
  {
    datasetPartId: 'dp-relationshipsB',
    decodedResponse: 'relationships\n42',
  },
  {
    datasetPartId: 'dp-productionOperation_KPIB',
    decodedResponse: 'productionOperation_kpi1,productionOperation_kpi2\n7,9',
  },
  {
    datasetPartId: 'dp-transport_KPIB',
    decodedResponse: 'transport_kpi1,transport_kpi2\n3,5',
  },
];

export const DATASET_B_TABLE_DECODED_RESPONSE =
  'name,source,destination\n' +
  'car,Paris,Lyon\n' +
  'train,Paris,Marseille\n' +
  'plane,Paris,Nice\n' +
  'boat,Paris,Bordeaux\n';
