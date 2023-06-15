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
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'restock_qty',
      labels: { fr: 'Restock', en: 'Restock' },
      varType: 'number',
      defaultValue: '5',
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'evaluation',
      defaultValue: 'Good',
      labels: { fr: 'Evaluation', en: 'Evaluation' },
      varType: 'string',
    },
  ],
  parameterGroups: [
    {
      id: 'basic_types',
      labels: { fr: 'Bar', en: 'Pub' },
      isTable: null,
      options: null,
      parentId: null,
      parameters: ['stock', 'restock_qty'],
    },
    {
      id: 'dataset_parts',
      labels: { fr: 'Valeurs initiales', en: 'Initial values' },
      isTable: null,
      options: null,
      parameters: ['evaluation'],
      parentId: null,
    },
  ],
  runTemplates: [
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: '1',
      name: 'Run template with mixed int and number parameters',
      description: 'Run template with both int and number varTypes parameters',
      tags: ['1', 'int', 'number'],
      fetchScenarioParameters: true,
      applyParameters: true,
      sendDatasetsToDataWarehouse: true,
      sendInputParametersToDataWarehouse: true,
      parameterGroups: ['basic_types', 'dataset_parts'],
    },
  ],
};

export const SOLUTIONS = [SOLUTION_WITH_MIXED_INT_NUMBER_PARAMETERS];
