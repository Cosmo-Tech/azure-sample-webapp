// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Use the SOLUTIONS array below to override or add information to your solutions. This can be useful for development
// purposes, but it is recommended to leave this array empty and use the API to update your Solution instead for
// production environments.
export const SOLUTIONS = [
  {
    id: 'sol-414m4e1q72em8',
    runTemplates: [
      {
        id: 'etl_mock_parameters',
        labels: {
          fr: "Run template d'ETL avec paramètres basiques fictifs",
          en: 'ETL run template with mock basic types parameters',
        },
        tags: ['datasource'],
        name: 'ETL run template with mock basic types parameters',
        description: 'ETL run template with mock basic types parameters',
        parameterGroups: [
          'basic_types',
          'dataset_parts',
          'extra_dataset_part',
          'customers',
          'events',
          'additional_parameters',
          'initial_state',
        ],
      },
    ],
  },
];
