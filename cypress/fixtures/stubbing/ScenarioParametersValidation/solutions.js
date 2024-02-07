// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION, RUN_TEMPLATE_EXAMPLE, SOLUTION_PARAMETER_EXAMPLE } from '../default';

const SOLUTION_WITH_ALL_TYPES_OF_PARAMETERS = {
  ...DEFAULT_SOLUTION,
  parameters: [
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'stock',
      labels: { fr: 'Stock', en: 'Stock' },
      varType: 'int',
      defaultValue: '20',
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
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'start_date',
      labels: {
        fr: 'Date de départ',
        en: 'Start date',
      },
      varType: 'date',
      defaultValue: '2014-08-18T19:11:54.000Z',
      minValue: null,
      maxValue: null,
      regexValidation: null,
      options: null,
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'end_date',
      labels: {
        fr: 'Date de fin',
        en: 'End date',
      },
      varType: 'date',
      defaultValue: '2014-08-20T19:11:54.000Z',
      minValue: null,
      maxValue: null,
      regexValidation: null,
      options: {
        validation: '> start_date',
      },
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'additional_date',
      labels: {
        en: 'Additional date',
        fr: 'Date additionnelle',
      },
      varType: 'date',
      defaultValue: '2022-06-22T00:00:00.000Z',
      minValue: '2021-01-01T00:00:00.000Z',
      maxValue: '2022-12-31T00:00:00.000Z',
      regexValidation: null,
      options: {
        validation: '!= end_date',
      },
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'example_dataset_part_1',
      labels: { fr: 'Exemple de sous-partie de dataset 1', en: 'Example dataset part 1' },
      varType: '%DATASETID%',
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'example_dataset_part_2',
      labels: { fr: 'Exemple de sous-partie de dataset 2', en: 'Example dataset part 2' },
      varType: '%DATASETID%',
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
      parameters: ['evaluation', 'comment', 'currency_name', 'example_dataset_part_1', 'example_dataset_part_2'],
      parentId: null,
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
      parameters: ['start_date', 'end_date', 'additional_date'],
    },
  ],
  runTemplates: [
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: '1',
      name: 'Run template for parameters validation',
      description: 'Run template for scenario parameters input validation',
      tags: ['1', 'validation'],
      fetchScenarioParameters: true,
      applyParameters: true,
      sendDatasetsToDataWarehouse: true,
      sendInputParametersToDataWarehouse: true,
      parameterGroups: ['basic_types', 'dataset_parts', 'additional_parameters'],
    },
  ],
};

const SOLUTION_WITH_CONSTRAINTS_BETWEEN_PARAMETERS = {
  ...DEFAULT_SOLUTION,
  parameters: [
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'stock',
      labels: { fr: 'Stock', en: 'Stock' },
      varType: 'int',
      defaultValue: '20',
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
      options: {
        validation: '< stock',
      },
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'nb_waiters',
      labels: { fr: 'Serveurs', en: 'Waiters' },
      varType: 'number',
      defaultValue: '2',
      minValue: 1,
      options: {
        validation: '<= restock_qty',
      },
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
        validation: '!= comment',
      },
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'start_date',
      labels: {
        fr: 'Date de départ',
        en: 'Start date',
      },
      varType: 'date',
      defaultValue: '2014-08-18T19:11:54.000Z',
      minValue: null,
      maxValue: null,
      regexValidation: null,
      options: null,
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'end_date',
      labels: {
        fr: 'Date de fin',
        en: 'End date',
      },
      varType: 'date',
      defaultValue: '2014-08-20T19:11:54.000Z',
      minValue: null,
      maxValue: null,
      regexValidation: null,
      options: {
        validation: '> start_date',
      },
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'additional_date',
      labels: {
        en: 'Additional date',
        fr: 'Date additionnelle',
      },
      varType: 'date',
      defaultValue: '2022-06-22T00:00:00.000Z',
      minValue: '2021-01-01T00:00:00.000Z',
      maxValue: '2022-12-31T00:00:00.000Z',
      regexValidation: null,
      options: {
        validation: '!= end_date',
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
    {
      id: 'additional_parameters',
      labels: {
        en: 'Additional parameters',
        fr: 'Paramètres additionnels',
      },
      isTable: null,
      options: null,
      parentId: null,
      parameters: ['start_date', 'end_date', 'additional_date'],
    },
  ],
  runTemplates: [
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: '1',
      name: 'Run template for parameters validation',
      description: 'Run template for scenario parameters input validation',
      tags: ['1', 'validation'],
      fetchScenarioParameters: true,
      applyParameters: true,
      sendDatasetsToDataWarehouse: true,
      sendInputParametersToDataWarehouse: true,
      parameterGroups: ['basic_types', 'dataset_parts', 'additional_parameters'],
    },
  ],
};

const SOLUTION_WITH_WRONG_CONSTRAINT_CONFIGURATION = {
  ...DEFAULT_SOLUTION,
  parameters: [
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'start_date',
      labels: {
        fr: 'Date de départ',
        en: 'Start date',
      },
      varType: 'date',
      defaultValue: '2014-08-18T19:11:54.000Z',
      minValue: null,
      maxValue: null,
      regexValidation: null,
      options: null,
    },
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'end_date',
      labels: {
        fr: 'Date de fin',
        en: 'End date',
      },
      varType: 'date',
      defaultValue: '2014-08-17T19:11:54.000Z',
      minValue: null,
      maxValue: null,
      regexValidation: null,
      options: {
        validation: '> start_date',
      },
    },
  ],
  parameterGroups: [
    {
      id: 'basic_types',
      labels: {
        en: 'Additional parameters',
        fr: 'Paramètres additionnels',
      },
      isTable: null,
      options: null,
      parentId: null,
      parameters: ['start_date', 'end_date'],
    },
  ],
  runTemplates: [
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: '1',
      name: 'Run template for parameters validation',
      description: 'Run template for scenario parameters input validation',
      tags: ['1', 'validation'],
      fetchScenarioParameters: true,
      applyParameters: true,
      sendDatasetsToDataWarehouse: true,
      sendInputParametersToDataWarehouse: true,
      parameterGroups: ['basic_types'],
    },
  ],
};
export const SOLUTIONS = [SOLUTION_WITH_ALL_TYPES_OF_PARAMETERS];
export const SOLUTIONS_WITH_WRONG_CONSTRAINT = [SOLUTION_WITH_WRONG_CONSTRAINT_CONFIGURATION];
export const SOLUTIONS_WITH_CONSTRAINTS = [SOLUTION_WITH_CONSTRAINTS_BETWEEN_PARAMETERS];
