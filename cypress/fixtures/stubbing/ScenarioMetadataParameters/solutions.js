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
  hidden: true,
  labels: null,
}));

const SOLUTION_WITH_SCENARIO_METADATA_PARAMETERS = {
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
  ],
  runTemplates: [
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: '1',
      name: 'Run template with scenario metadata parameters',
      description: 'Run template with scenario metadata parameters',
      tags: ['1', 'metadata'],
      fetchScenarioParameters: true,
      applyParameters: true,
      sendDatasetsToDataWarehouse: true,
      sendInputParametersToDataWarehouse: true,
      parameterGroups: ['bar_parameters'],
    },
  ],
};

export const SOLUTIONS = [SOLUTION_WITH_SCENARIO_METADATA_PARAMETERS];
