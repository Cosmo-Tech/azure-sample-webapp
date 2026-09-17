// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  DEFAULT_RUNNER_BASE_DATASET,
  DEFAULT_SIMULATION_RUNNER,
  DEFAULT_SOLUTION,
} from './default';

const TWO_TABLES_GROUP = {
  id: 'two_tables_group',
  parameters: ['dynamic_table', 'editable_table'],
};

const DYNAMIC_TABLE_PARAM = {
  id: 'dynamic_table',
  varType: '%DATASET_PART_ID_FILE%',
  additionalData: {
    subType: 'TABLE',
    dynamicValues: { datasetPartName: 'dynamic_data' },
    columns: [
      { field: 'product', type: ['string', 'nonEditable'] },
      {
        field: 'stock',
        type: ['int', 'nonEditable'],
      },
    ],
  },
};

const EDITABLE_TABLE_PARAM = {
  id: 'editable_table',
  varType: '%DATASET_PART_ID_FILE%',
  additionalData: {
    subType: 'TABLE',
    canChangeRowsNumber: true,
    columns: [
      { field: 'item', type: ['string'] },
      {
        field: 'quantity',
        type: ['int'],
      },
    ],
  },
};

const CUSTOM_RUN_TEMPLATE = {
  id: 'sim_two_tables_inheritance',
  name: 'Run template with two table parameters',
  tags: ['sim_two_tables_inheritance'],
  parameterGroups: [TWO_TABLES_GROUP.id],
};

export const SOLUTION_WITH_TWO_TABLES = {
  ...DEFAULT_SOLUTION,
  runTemplates: [CUSTOM_RUN_TEMPLATE],
  parameters: [DYNAMIC_TABLE_PARAM, EDITABLE_TABLE_PARAM],
  parameterGroups: [TWO_TABLES_GROUP],
};

export const PARENT_BASE_DATASET = {
  ...DEFAULT_RUNNER_BASE_DATASET,
  id: 'd-parentBaseDataset',
  parts: [
    {
      id: 'dp-parentDynamicPart',
      name: 'dynamic_data',
      type: 'DB',
      organizationId: DEFAULT_RUNNER_BASE_DATASET.organizationId,
      workspaceId: DEFAULT_RUNNER_BASE_DATASET.workspaceId,
      datasetId: 'd-parentBaseDataset',
    },
  ],
};

export const CHILD_BASE_DATASET = {
  ...DEFAULT_RUNNER_BASE_DATASET,
  id: 'd-childBaseDataset',
  parts: [
    {
      id: 'dp-childDynamicPart',
      name: 'dynamic_data',
      type: 'DB',
      organizationId: DEFAULT_RUNNER_BASE_DATASET.organizationId,
      workspaceId: DEFAULT_RUNNER_BASE_DATASET.workspaceId,
      datasetId: 'd-childBaseDataset',
    },
  ],
};

export const PARENT_RUNNER_PARAMETER_DATASET_ID = 'd-parentRunnerParameterDataset';
export const CHILD_RUNNER_PARAMETER_DATASET_ID = 'd-childRunnerParameterDataset';
export const PARENT_EDITABLE_TABLE_PART_ID = 'dp-parentEditableTable';
export const CHILD_EDITABLE_TABLE_PART_ID = 'dp-childEditableTable';

export const PARENT_RUNNER = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-twoTablesParent',
  name: 'Cypress - Two tables parent scenario',
  runTemplateId: CUSTOM_RUN_TEMPLATE.id,
  runTemplateName: CUSTOM_RUN_TEMPLATE.name,
  datasets: {
    bases: [PARENT_BASE_DATASET.id],
    parameter: PARENT_RUNNER_PARAMETER_DATASET_ID,
    parameters: [
      {
        id: PARENT_EDITABLE_TABLE_PART_ID,
        name: EDITABLE_TABLE_PARAM.id,
        datasetId: PARENT_RUNNER_PARAMETER_DATASET_ID,
        sourceName: 'editable_table.csv',
      },
    ],
  },
  parentId: null,
  rootId: null,
};

export const CHILD_RUNNER = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-twoTablesChild',
  name: 'Cypress - Two tables child scenario',
  runTemplateId: CUSTOM_RUN_TEMPLATE.id,
  runTemplateName: CUSTOM_RUN_TEMPLATE.name,
  datasets: {
    bases: [CHILD_BASE_DATASET.id],
    parameter: CHILD_RUNNER_PARAMETER_DATASET_ID,
    parameters: [
      {
        id: CHILD_EDITABLE_TABLE_PART_ID,
        name: EDITABLE_TABLE_PARAM.id,
        datasetId: CHILD_RUNNER_PARAMETER_DATASET_ID,
        sourceName: 'editable_table.csv',
      },
    ],
  },
  parentId: PARENT_RUNNER.id,
  rootId: PARENT_RUNNER.id,
};
