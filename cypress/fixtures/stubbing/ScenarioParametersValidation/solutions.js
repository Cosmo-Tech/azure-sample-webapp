// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DEFAULT_SOLUTION, RUN_TEMPLATE_EXAMPLE, SOLUTION_PARAMETER_EXAMPLE } from '../default';

const SOLUTION_WITH_MIXED_INT_NUMBER_PARAMETERS = {
  ...DEFAULT_SOLUTION,
  parameters: [
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'stock',
      labels: { fr: 'Stock', en: 'Stock' },
      varType: 'int',
      defaultValue: '1O',
      minValue: -10,
      maxValue: 100,
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'restock_qty',
      labels: { fr: 'Restock', en: 'Restock' },
      varType: 'number',
      defaultValue: '5',
      maxValue: 25,
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'nb_waiters',
      labels: { fr: 'Serveurs', en: 'Waiters' },
      varType: 'number',
      defaultValue: '2',
      minValue: 1,
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'comment',
      defaultValue: 'None',
      labels: { fr: 'Commentaire', en: 'Comment' },
      varType: 'string',
      options: {
        maxLength: 30,
      },
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'evaluation',
      defaultValue: 'Good',
      labels: { fr: 'Evaluation', en: 'Evaluation' },
      varType: 'string',
      options: {
        minLength: 2,
      },
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'currency_name',
      defaultValue: 'EUR',
      labels: { fr: 'Nom de la monnaie', en: 'Currency name' },
      varType: 'string',
      options: {
        minLength: 2,
        maxLength: 10,
      },
    },
  ],
  parameterGroups: [
    {
      id: 'basic_types',
      labels: { fr: 'Bar', en: 'Pub' },
      isTable: null,
      options: null,
      parentId: null,
      parameters: ['stock', 'restock_qty', 'nb_waiters'],
    },
    {
      id: 'dataset_parts',
      labels: { fr: 'Valeurs initiales', en: 'Initial values' },
      isTable: null,
      options: null,
      parameters: ['evaluation', 'comment', 'currency_name'],
      parentId: null,
    },
  ],
  runTemplates: [
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: '1',
      name: 'Run template with mixed int and number parameters',
      description: 'Run template for scenario parameters input validation',
      tags: ['1', 'validation'],
      fetchScenarioParameters: true,
      applyParameters: true,
      sendDatasetsToDataWarehouse: true,
      sendInputParametersToDataWarehouse: true,
      parameterGroups: ['basic_types', 'dataset_parts'],
    },
  ],
};

export const SOLUTIONS = [SOLUTION_WITH_MIXED_INT_NUMBER_PARAMETERS];
