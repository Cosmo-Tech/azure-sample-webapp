// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION, RUN_TEMPLATE_EXAMPLE, SOLUTION_PARAMETER_EXAMPLE } from '../default';

const CUSTOM_SOLUTION = {
  ...DEFAULT_SOLUTION,
  parameters: [{ ...SOLUTION_PARAMETER_EXAMPLE, id: 'start_date', varType: 'date' }],
  parameterGroups: [
    {
      id: 'all_parameters',
      parameters: ['start_date'],
    },
  ],
  runTemplates: [
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: 'all_parameters',
      name: 'Run template with all parameters',
      description: 'Run template with all parameters',
      tags: ['all_parameters'],
      parameterGroups: ['all_parameters'],
    },
  ],
};

export const SOLUTIONS = [CUSTOM_SOLUTION];
