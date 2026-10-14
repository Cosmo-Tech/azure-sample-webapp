// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_RUNNER_BASE_DATASET, DEFAULT_RUNNER_PARAMETER_DATASET, DEFAULT_SIMULATION_RUNNER } from '../default';
import { FILE_PARAMETER_PART_ID, STATIC_TABLE_PART_ID } from './datasets';
import { READ_ONLY_RUN_TEMPLATE } from './solutions';

export const RUNNERS = [
  {
    ...DEFAULT_SIMULATION_RUNNER,
    id: 'r-readOnlyParameters',
    name: 'Cypress - Read-only parameters',
    runTemplateId: READ_ONLY_RUN_TEMPLATE.id,
    runTemplateName: READ_ONLY_RUN_TEMPLATE.name,
    datasets: {
      bases: [DEFAULT_RUNNER_BASE_DATASET.id],
      parameter: DEFAULT_RUNNER_PARAMETER_DATASET.id,
      parameters: [
        {
          id: FILE_PARAMETER_PART_ID,
          name: 'readonly_file',
          datasetId: DEFAULT_RUNNER_PARAMETER_DATASET.id,
          sourceName: 'read_only_file.csv',
        },
        {
          id: STATIC_TABLE_PART_ID,
          name: 'readonly_table_events',
          datasetId: DEFAULT_RUNNER_PARAMETER_DATASET.id,
          sourceName: 'read_only_events.csv',
        },
      ],
    },
    parametersValues: [],
  },
];
