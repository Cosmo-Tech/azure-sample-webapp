// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { PARAMETER_GROUPS } from './runTemplateParameterGroups';

export const RUN_TEMPLATE_EXAMPLE = {
  id: 'sim_run_template_example',
  name: 'MyRunTemplate',
  description: 'My run template description',
  csmSimulation: 'BreweryDemoSimulationWithConnector',
  tags: ['sim_run_template_example'],
  computeSize: null,
  parameterGroups: [PARAMETER_GROUPS.BAR_PARAMETERS.id],
  executionTimeout: null,
  runSizing: null,
};

export const BREWERY_PARAMETERS_RUN_TEMPLATE = {
  ...RUN_TEMPLATE_EXAMPLE,
  id: 'sim_brewery_parameters',
  name: 'Run template with Brewery parameters',
  description: 'Run template with Brewery parameters',
  tags: ['sim_brewery_parameters', 'With params'],
  parameterGroups: [PARAMETER_GROUPS.BAR_PARAMETERS.id, PARAMETER_GROUPS.FILE_UPLOAD.id],
};

export const NO_PARAMETERS_RUN_TEMPLATE = {
  ...RUN_TEMPLATE_EXAMPLE,
  id: 'sim_no_parameters',
  name: 'Run template without parameters',
  description: 'Run template without parameters',
  tags: ['sim_no_parameters', 'No param'],
  parameterGroups: [],
};

export const BASIC_TYPES_PARAMETERS_RUN_TEMPLATE = {
  ...RUN_TEMPLATE_EXAMPLE,
  id: 'sim_mock_parameters',
  name: 'Run template with mock basic types parameters',
  description: 'Run template with mock basic types parameters',
  tags: ['sim_mock_parameters', 'Example'],
  parameterGroups: [
    PARAMETER_GROUPS.BASIC_TYPES.id,
    PARAMETER_GROUPS.DATASET_PARTS.id,
    PARAMETER_GROUPS.EXTRA_DATASET_PART.id,
    PARAMETER_GROUPS.CUSTOMERS.id,
    PARAMETER_GROUPS.EVENTS.id,
    PARAMETER_GROUPS.ADDITIONAL_PARAMETERS.id,
  ],
};

export const HIDDEN_RUN_TEMPLATE = {
  ...RUN_TEMPLATE_EXAMPLE,
  id: 'hidden test run template',
  name: 'Hidden test run template without parameters',
  description: 'Run template without parameters',
  tags: ['2', 'No param'],
  parameterGroups: [],
};

export const ETL_RUN_TEMPLATE = {
  id: 'etl_run_template',
  labels: { en: 'ETL run template with dynamic filter', fr: 'Run template avec un filtre dynamique' },
  tags: ['datasource'],
};

export const PARTIALLY_PREFILLED_DATASOURCE = {
  id: 'partially_prefilled_datasource',
  parameterGroups: [PARAMETER_GROUPS.PARTIALLY_PREFILLED.id],
  tags: ['datasource'],
};

export const CUSTOM_SUBDATASOURCES = [
  { id: 'no_filter', parameterGroups: [], tags: ['subdatasource'] },
  { id: 'enum_filter', parameterGroups: [PARAMETER_GROUPS.ENUM.id], tags: ['subdatasource'] },
  { id: 'list_filter', parameterGroups: [PARAMETER_GROUPS.LIST.id], tags: ['subdatasource'] },
  { id: 'string_filter', parameterGroups: [PARAMETER_GROUPS.STRING.id], tags: ['subdatasource'] },
  { id: 'date_filter', parameterGroups: [PARAMETER_GROUPS.DATE.id], tags: ['subdatasource'] },
];

export const DYNAMIC_VALUES_ENUM_FILTER = {
  id: 'dynamic_values_enum_filter',
  parameterGroups: [PARAMETER_GROUPS.DYNAMIC_VALUES_CUSTOMERS.id],
  tags: ['subdatasource'],
};

export const SUBDATASET_RUN_TEMPLATE = {
  id: 'subdataset_run_template',
  labels: {
    en: 'Subdataset run template with static filter',
    fr: 'Run template de sous-dataset avec un filtre statique',
  },
  tags: ['subdatasource'],
};
