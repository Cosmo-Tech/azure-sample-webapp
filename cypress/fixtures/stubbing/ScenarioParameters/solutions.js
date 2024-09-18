// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION } from '../default';

const dynamicRunTemplate = [
  {
    id: 'dynamic_values',
    name: 'Run template with dynamic values',
    parameterGroups: ['bar_parameters', 'basic_types', 'additional_parameters', 'events'],
  },
];
export const SOLUTION_WITH_DYNAMIC_PARAMETERS = {
  ...DEFAULT_SOLUTION,
  parameters: [
    ...DEFAULT_SOLUTION.parameters,
    {
      id: 'dynamic_int',
      varType: 'int',
      options: {
        dynamicValues: {
          type: 'cypher',
          query: 'MATCH (c:Customer) RETURN count(c) AS stock',
          resultKey: 'stock',
        },
      },
    },
    {
      id: 'dynamic_number',
      varType: 'number',
      options: {
        dynamicValues: {
          type: 'cypher',
          query: 'MATCH (c:Customer) RETURN count(c) AS restock',
          resultKey: 'restock',
        },
      },
    },
    {
      id: 'dynamic_number_error',
      varType: 'int',
      options: {
        dynamicValues: {
          type: 'cypher',
          query: 'MATCH (c:Customer) RETURN count(c) AS waiters',
          resultKey: 'waiter',
        },
      },
    },
    {
      id: 'not_dynamic_int',
      varType: 'int',
      defaultValue: 28,
    },
  ],
  parameterGroups: [
    {
      id: 'bar_parameters',
      labels: { fr: 'Bar', en: 'Pub' },
      isTable: null,
      options: null,
      parentId: null,
      parameters: ['stock', 'restock_qty', 'nb_waiters'],
    },
    {
      id: 'basic_types',
      parameters: ['dynamic_int', 'not_dynamic_int'],
    },
    {
      id: 'additional_parameters',
      labels: {
        en: 'Additional parameters',
        fr: 'Paramètres additionnels',
      },
      isTable: null,
      options: null,
      parentId: null,
      parameters: ['dynamic_number'],
    },
    {
      id: 'events',
      labels: {
        en: 'Events',
        fr: 'Évènements',
      },
      isTable: null,
      options: null,
      parentId: null,
      parameters: ['dynamic_number_error'],
    },
  ],
  runTemplates: [...DEFAULT_SOLUTION.runTemplates, ...dynamicRunTemplate],
};
