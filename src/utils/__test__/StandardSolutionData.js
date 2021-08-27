// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const STANDARD_SOLUTION = {
  parameterGroups: [
    {
      id: 'groupA',
      isTable: null,
      labels: {
        en: 'GroupA EN label',
        fr: 'GroupA FR label'
      },
      options: null,
      parameters: [
        'param1'
      ],
      parentId: null
    },
    {
      id: 'groupB',
      isTable: null,
      labels: {
        en: 'GroupB EN label',
        fr: 'GroupB FR label'
      },
      options: null,
      parameters: [
        'param2'
      ],
      parentId: null
    },
    {
      id: 'groupC',
      isTable: null,
      labels: {
        en: 'GroupC EN label',
        fr: 'GroupC FR label'
      },
      options: null,
      parameters: [
        'param1',
        'param2'
      ],
      parentId: null
    }
  ],
  parameters: [
    {
      defaultValue: null,
      id: 'param1',
      labels: {
        en: 'Param1 EN label',
        fr: 'Param1 FR label'
      },
      maxValue: null,
      minValue: null,
      options: null,
      regexValidation: null,
      varType: 'int'
    },
    {
      defaultValue: null,
      id: 'param2',
      labels: {
        en: 'Param2 EN label',
        fr: 'Param2 FR label'
      },
      maxValue: null,
      minValue: null,
      options: null,
      regexValidation: null,
      varType: 'string'
    }
  ],
  runTemplates: [
    {
      applyParameters: true,
      computeSize: null,
      csmSimulation: 'SomeSimulation',
      datasetValidatorSource: null,
      description: 'Words words words',
      fetchDatasets: true,
      fetchScenarioParameters: true,
      id: 'runTemplate1',
      name: 'Run template One',
      parameterGroups: [
        'groupA'
      ],
      parametersHandlerSource: null,
      parametersJson: null,
      postRun: false,
      postRunSource: null,
      preRun: false,
      preRunSource: null,
      run: null,
      runSource: null,
      sendDatasetsToDataWarehouse: true,
      sendInputParametersToDataWarehouse: true,
      stackSteps: null,
      tags: [],
      validateData: false
    },
    {
      applyParameters: true,
      computeSize: null,
      csmSimulation: 'SomeSimulation',
      datasetValidatorSource: null,
      description: 'Words words words',
      fetchDatasets: true,
      fetchScenarioParameters: true,
      id: 'runTemplate2',
      name: 'Run template Two',
      parameterGroups: [
        'groupA',
        'groupB'
      ],
      parametersHandlerSource: null,
      parametersJson: null,
      postRun: false,
      postRunSource: null,
      preRun: false,
      preRunSource: null,
      run: null,
      runSource: null,
      sendDatasetsToDataWarehouse: true,
      sendInputParametersToDataWarehouse: true,
      stackSteps: null,
      tags: [],
      validateData: false
    },
    {
      applyParameters: true,
      computeSize: null,
      csmSimulation: 'SomeSimulation',
      datasetValidatorSource: null,
      description: 'Words words words',
      fetchDatasets: true,
      fetchScenarioParameters: true,
      id: 'runTemplate3',
      name: 'Run template Three',
      parameterGroups: [
        'groupC'
      ],
      parametersHandlerSource: null,
      parametersJson: null,
      postRun: false,
      postRunSource: null,
      preRun: false,
      preRunSource: null,
      run: null,
      runSource: null,
      sendDatasetsToDataWarehouse: true,
      sendInputParametersToDataWarehouse: true,
      stackSteps: null,
      tags: [],
      validateData: false
    }
  ]
};
