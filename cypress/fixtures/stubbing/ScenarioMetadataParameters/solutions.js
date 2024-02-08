// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION, RUN_TEMPLATE_EXAMPLE, SOLUTION_PARAMETER_EXAMPLE } from '../default';

export const SCENARIO_METADATA_PARAMETERS_IDS = [
  'ScenarioName',
  'ScenarioId',
  'ParentId',
  'MasterId',
  'RunTemplateName',
  'ScenarioLastRunId',
  'ParentLastRunId',
  'MasterLastRunId',
];

const SCENARIO_METADATA_PARAMETERS = SCENARIO_METADATA_PARAMETERS_IDS.map((parameterId) => ({
  ...SOLUTION_PARAMETER_EXAMPLE,
  id: parameterId,
  varType: 'string',
  options: {
    hidden: true,
  },
  labels: null,
}));

const CUSTOM_SOLUTION = {
  ...DEFAULT_SOLUTION,
  parameters: [
    {
      ...SOLUTION_PARAMETER_EXAMPLE,
      id: 'stock',
      labels: { fr: 'Stock', en: 'Stock' },
      varType: 'int',
    },
    ...SCENARIO_METADATA_PARAMETERS, // Hidden scenario metadata parameters
  ],
  parameterGroups: [
    {
      id: 'bar_parameters',
      labels: { fr: 'Bar', en: 'Pub' },
      isTable: null,
      options: null,
      parentId: null,
      parameters: ['stock', ...SCENARIO_METADATA_PARAMETERS_IDS],
    },
    {
      id: 'explicitly_hidden_parameters_group',
      options: { hidden: true },
      parameters: ['stock'],
    },
    {
      id: 'implicitly_hidden_parameters_group',
      // This group will be hidden because all its parameters are defined as hidden
      parameters: [...SCENARIO_METADATA_PARAMETERS_IDS],
    },
  ],
  runTemplates: [
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: '1',
      name: 'Run template with scenario metadata parameters',
      description: 'Run template with scenario metadata parameters',
      tags: ['1', 'metadata'],
      parameterGroups: ['bar_parameters'],
    },
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: 'runTemplateWithHiddenGroups',
      name: 'Run template with hidden groups of scenario parameters',
      description: 'Run template with hidden groups of scenario parameters',
      tags: ['hidden', 'groups'],
      parameterGroups: ['explicitly_hidden_parameters_group', 'implicitly_hidden_parameters_group'],
    },
  ],
};

export const SOLUTIONS = [CUSTOM_SOLUTION];
