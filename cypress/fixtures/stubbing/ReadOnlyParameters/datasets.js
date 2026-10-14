// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_RUNNER_BASE_DATASET, DEFAULT_RUNNER_PARAMETER_DATASET } from '../default';

export const FILE_PARAMETER_PART_ID = 'dp-readonlyFile';
export const STATIC_TABLE_PART_ID = 'dp-readonlyEvents';
export const DYNAMIC_DATASET_PART_ID = 'dp-readonlyCustomerData';

const DYNAMIC_DATASET = {
  ...DEFAULT_RUNNER_BASE_DATASET,
  additionalData: {
    webapp: {
      ...DEFAULT_RUNNER_BASE_DATASET.additionalData.webapp,
      visible: { datasetManager: true, scenarioCreation: true },
    },
  },
  parts: [
    {
      id: DYNAMIC_DATASET_PART_ID,
      name: 'Customer',
      type: 'DB',
      organizationId: DEFAULT_RUNNER_BASE_DATASET.organizationId,
      workspaceId: DEFAULT_RUNNER_BASE_DATASET.workspaceId,
      datasetId: DEFAULT_RUNNER_BASE_DATASET.id,
    },
  ],
};

export const DATASETS = [DEFAULT_RUNNER_PARAMETER_DATASET, DYNAMIC_DATASET];

export const FILE_CONTENT = 'Read-only file content';

export const STATIC_TABLE_CONTENT =
  'theme,date,timeOfDay,eventType,reservationsNumber,online\nTasting,14/10/2025,morning,Private event,12,true';

export const DYNAMIC_TABLE_QUERY_RESPONSE =
  'id,Satisfaction,SurroundingSatisfaction,Thirsty\n' +
  'Customer1,3,5,true\n' +
  'Customer2,3,7,false\n' +
  'Customer3,3,0,true';
export const DYNAMIC_QUERY_RESPONSE =
  'id,count_id,Satisfaction,SurroundingSatisfaction,Thirsty\n' +
  'Customer1,3,5,6,true\n' +
  'Customer2,3,7,2,false\n' +
  'Customer3,3,0,9,true';
