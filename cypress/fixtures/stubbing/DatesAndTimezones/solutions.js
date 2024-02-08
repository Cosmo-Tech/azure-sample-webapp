// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION, RUN_TEMPLATE_EXAMPLE, SOLUTION_PARAMETER_EXAMPLE } from '../default';

const SCENARIO_PARAMETERS = [
  {
    ...SOLUTION_PARAMETER_EXAMPLE,
    id: 'start_date',
    varType: 'date',
    labels: null,
    defaultValue: '2025-01-13T00:00:00Z', // Winter time, date at midnight UTC
    minValue: '2025-01-01T00:00:00Z',
    maxValue: '2026-01-01T00:00:00Z',
  },
  {
    ...SOLUTION_PARAMETER_EXAMPLE,
    id: 'end_date',
    varType: 'date',
    labels: null,
    defaultValue: '2025-07-13T12:00:00Z', // Summer time, date NOT at midnight UTC
    minValue: '2025-07-01T00:00:00Z',
    maxValue: '2026-07-01T00:00:00Z',
    options: { validation: '> start_date' },
  },
];

export const SOLUTION = {
  ...DEFAULT_SOLUTION,
  parameters: SCENARIO_PARAMETERS,
  parameterGroups: [{ id: 'dates', parameters: ['start_date', 'end_date'] }],
  runTemplates: [
    {
      ...RUN_TEMPLATE_EXAMPLE,
      id: 'dates',
      name: 'Run template with dates',
      description: 'Run template with dates',
      tags: [],
      parameterGroups: ['dates'],
    },
  ],
};
