// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const SCENARIO_RUN_EXAMPLE = {
  id: 'sr-stbdscnrun00',
  state: null,
  organizationId: 'O-stbdorgnzn',
  workflowId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  csmSimulationRun: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  generateName: 'workflow-s-xxxxxxxxxxxx-',
  workflowName: 'workflow-s-xxxxxxxxxxxx-xxxxx',
  ownerId: 'xxxxxxxx-xxxx-daxe-xxxx-xxxxxxxxxxxx',
  workspaceId: 'W-stbbdbrwry',
  workspaceKey: 'DemoBrewery',
  scenarioId: 's-stubbedscnr01',
  solutionId: 'SOL-stubbedbrwy',
  runTemplateId: '3',
  computeSize: null,
  sdkVersion: null,
  noDataIngestionState: null,
  datasetList: ['D-4jwyQnmv7jx'],
  parametersValues: [
    { parameterId: 'currency', value: 'USD', varType: 'enum' },
    { parameterId: 'currency_name', value: 'EUR', varType: 'string' },
    { parameterId: 'currency_value', value: '1000', varType: 'number' },
    { parameterId: 'currency_used', value: 'false', varType: 'bool' },
    { parameterId: 'start_date', value: '2014-08-18T19:11:54.000Z', varType: 'date' },
    { parameterId: 'events', value: 'd-xolyln1kq85d', varType: '%DATASETID%' },
    { parameterId: 'additional_seats', value: '-4', varType: 'number' },
    { parameterId: 'activated', value: 'false', varType: 'bool' },
    { parameterId: 'evaluation', value: 'Good', varType: 'string' },
    { parameterId: 'volume_unit', value: 'LITRE', varType: 'enum' },
    { parameterId: 'additional_tables', value: '3', varType: 'number' },
    { parameterId: 'comment', value: 'None', varType: 'string' },
    { parameterId: 'additional_date', value: '2022-06-21T22:00:00.000Z', varType: 'date' },
  ],
  sendDatasetsToDataWarehouse: true,
  sendInputParametersToDataWarehouse: false,
  nodeLabel: 'basicpool',
  containers: null,
};

export const DEFAULT_SCENARIO_RUNS_LIST = [
  {
    ...SCENARIO_RUN_EXAMPLE,
    id: 'sr-stbdscnrun01',
  },
];
