// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';
import { ScenarioParametersUtils } from '../ScenarioParametersUtils';
import { STANDARD_SOLUTION } from './StandardSolutionData';

const clone = rfdc();

const getParamDataFromStandardSolution = (parameterId) => {
  return STANDARD_SOLUTION.parameters.find(param => param.id === parameterId);
};

describe('generateParametersGroupsMetadata with missing data in solution', () => {
  let solution;
  let spyConsoleWarn;

  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  beforeEach(() => {
    solution = clone(STANDARD_SOLUTION);
  });

  const expectedGroupsDataForRunTemplate1WhenNoParameters = [
    {
      id: 'groupA',
      labels: {
        en: 'GroupA EN label',
        fr: 'GroupA FR label'
      },
      parameters: []
    }
  ];

  test.each`
    field                   | fieldValue    | expectedRes
    ${'runTemplates'}       | ${undefined}  | ${[]}
    ${'runTemplates'}       | ${null}       | ${[]}
    ${'runTemplates'}       | ${[]}         | ${[]}
    ${'parameterGroups'}    | ${undefined}  | ${[]}
    ${'parameterGroups'}    | ${null}       | ${[]}
    ${'parameterGroups'}    | ${[]}         | ${[]}
    ${'parameters'}         | ${undefined}  | ${expectedGroupsDataForRunTemplate1WhenNoParameters}
    ${'parameters'}         | ${null}       | ${expectedGroupsDataForRunTemplate1WhenNoParameters}
    ${'parameters'}         | ${[]}         | ${expectedGroupsDataForRunTemplate1WhenNoParameters}
  `('if $field is $fieldValue', ({ field, fieldValue, expectedRes }) => {
    solution[field] = fieldValue;
    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, {}, 'runTemplate1');
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
    expect(res).toStrictEqual(expectedRes);
  });

  test.each`
    fieldsValue
    ${undefined}
    ${null}
    ${[]}
  `('if runTemplates, parameterGroups and parameters are $fieldsValue', ({ fieldsValue }) => {
    solution.runTemplates = fieldsValue;
    solution.parameterGroups = fieldsValue;
    solution.parameters = fieldsValue;
    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, {}, 'runTemplate1');
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
    expect(res).toStrictEqual([]);
  });
});

describe('generateParametersGroupsMetadata with missing data in config', () => {
  let solution;
  let config;

  beforeEach(() => {
    solution = clone(STANDARD_SOLUTION);
    config = clone({});
  });

  const expectedGroupsDataForRunTemplate1 = [
    {
      id: 'groupA',
      labels: {
        en: 'GroupA EN label',
        fr: 'GroupA FR label'
      },
      parameters: [getParamDataFromStandardSolution('param1')]
    }
  ];

  test.each`
    field                   | fieldValue
    ${'runTemplates'}       | ${undefined}
    ${'runTemplates'}       | ${null}
    ${'runTemplates'}       | ${[]}
    ${'parameterGroups'}    | ${undefined}
    ${'parameterGroups'}    | ${null}
    ${'parameterGroups'}    | ${[]}
    ${'parameters'}         | ${undefined}
    ${'parameters'}         | ${null}
    ${'parameters'}         | ${[]}
  `('if $field is $fieldValue', ({ field, fieldValue, expectedRes }) => {
    config[field] = fieldValue;
    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, config, 'runTemplate1');
    expect(res).toStrictEqual(expectedGroupsDataForRunTemplate1);
  });

  test.each`
    fieldsValue
    ${undefined}
    ${null}
    ${[]}
  `('if runTemplates, parameterGroups and parameters are $fieldsValue', ({ fieldsValue }) => {
    config.runTemplates = fieldsValue;
    config.parameterGroups = fieldsValue;
    config.parameters = fieldsValue;
    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, config, 'runTemplate1');
    expect(res).toStrictEqual(expectedGroupsDataForRunTemplate1);
  });

  test('must respect the parameters groups order defined in the solution', () => {
    const config = {
      parameters: {},
      parametersGroups: {},
      runTemplates: {}
    };
    const expectedGroupsDataForRunTemplate2 = [
      {
        id: 'groupA',
        labels: {
          en: 'GroupA EN label',
          fr: 'GroupA FR label'
        },
        parameters: [getParamDataFromStandardSolution('param1')]
      },
      {
        id: 'groupB',
        labels: {
          en: 'GroupB EN label',
          fr: 'GroupB FR label'
        },
        parameters: [getParamDataFromStandardSolution('param2')]
      }
    ];
    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, config, 'runTemplate2');
    expect(res).toStrictEqual(expectedGroupsDataForRunTemplate2);
  });

  test('must respect the parameters order defined in the solution', () => {
    const config = {
      parameters: {},
      parametersGroups: {},
      runTemplates: {}
    };
    const expectedGroupsDataForRunTemplate3 = [
      {
        id: 'groupC',
        labels: {
          en: 'GroupC EN label',
          fr: 'GroupC FR label'
        },
        parameters: [
          getParamDataFromStandardSolution('param1'),
          getParamDataFromStandardSolution('param2')
        ]
      }
    ];
    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, config, 'runTemplate3');
    expect(res).toStrictEqual(expectedGroupsDataForRunTemplate3);
  });
});

describe('generateParametersGroupsMetadata with config overwrite', () => {
  let solution;
  beforeEach(() => {
    solution = clone(STANDARD_SOLUTION);
  });

  test('to change an existing run template to show a different parameter group', () => {
    const config = {
      parameters: {},
      parametersGroups: {},
      runTemplates: {
        runTemplate1: {
          parameterGroups: [
            'groupB'
          ]
        }
      }
    };

    const expectedGroupsDataForRunTemplate1 = [
      {
        id: 'groupB',
        labels: {
          en: 'GroupB EN label',
          fr: 'GroupB FR label'
        },
        parameters: [getParamDataFromStandardSolution('param2')]
      }
    ];

    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, config, 'runTemplate1');
    expect(res).toStrictEqual(expectedGroupsDataForRunTemplate1);
  });

  test('to change labels of parameters and parameters groups', () => {
    const config = {
      parameters: {
        param1: {
          labels: {
            en: 'New EN label for param1',
            fr: 'New FR label for param1'
          }
        }
      },
      parametersGroups: {
        groupA: {
          labels: {
            en: 'New EN label for groupA',
            fr: 'New FR label for groupA'
          }
        }
      },
      runTemplates: {}
    };

    const param1Data = getParamDataFromStandardSolution('param1');
    param1Data.labels = {
      en: 'New EN label for param1',
      fr: 'New FR label for param1'
    };
    const expectedGroupsDataForRunTemplate1 = [
      {
        id: 'groupA',
        labels: {
          en: 'New EN label for groupA',
          fr: 'New FR label for groupA'
        },
        parameters: [param1Data]
      }
    ];

    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, config, 'runTemplate1');
    expect(res).toStrictEqual(expectedGroupsDataForRunTemplate1);
  });

  test('to change display order of parameters groups', () => {
    const config = {
      parameters: {},
      parametersGroups: {},
      runTemplates: {
        runTemplate2: {
          parameterGroups: [
            'groupB',
            'groupA'
          ]
        }
      }
    };

    const expectedGroupsDataForRunTemplate2 = [
      {
        id: 'groupB',
        labels: {
          en: 'GroupB EN label',
          fr: 'GroupB FR label'
        },
        parameters: [getParamDataFromStandardSolution('param2')]
      },
      {
        id: 'groupA',
        labels: {
          en: 'GroupA EN label',
          fr: 'GroupA FR label'
        },
        parameters: [getParamDataFromStandardSolution('param1')]
      }
    ];

    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, config, 'runTemplate2');
    expect(res).toStrictEqual(expectedGroupsDataForRunTemplate2);
  });

  test('to change display order of parameters', () => {
    const config = {
      parameters: {},
      parametersGroups: {
        groupC: {
          parameters: [
            'param2',
            'param1'
          ]
        }
      },
      runTemplates: {}
    };

    const expectedGroupsDataForRunTemplate3 = [
      {
        id: 'groupC',
        labels: {
          en: 'GroupC EN label',
          fr: 'GroupC FR label'
        },
        parameters: [
          getParamDataFromStandardSolution('param2'),
          getParamDataFromStandardSolution('param1')
        ]
      }
    ];

    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, config, 'runTemplate3');
    expect(res).toStrictEqual(expectedGroupsDataForRunTemplate3);
  });
});

describe('getDefaultParametersValues with empty solution and empty config', () => {
  let spyConsoleWarn;

  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  test.each`
    solutionParameters  | configParameters
    ${undefined}        | ${undefined}
    ${undefined}        | ${null}
    ${undefined}        | ${{}}
    ${null}             | ${undefined}
    ${null}             | ${null}
    ${null}             | ${{}}
    ${[]}               | ${undefined}
    ${[]}               | ${null}
    ${[]}               | ${{}}
  `('if solutionParameters is $solutionParameters and configParameters is $configParameters', (
    { solutionParameters, configParameters }) => {
    const res = ScenarioParametersUtils.getDefaultParametersValues(
      ['unknownParameter'], solutionParameters, configParameters);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(2);
    expect(res).toStrictEqual({ unknownParameter: undefined });
  });
});

describe('getDefaultParametersValues with solution or config', () => {
  let spyConsoleWarn;

  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  const someSolutionParameter = [
    {
      id: 'someParameter',
      defaultValue: 'someDefaultValue'
    }
  ];
  const someConfigParameter = {
    someParameter: {
      defaultValue: 'someDefaultValue'
    }
  };

  test.each`
    solutionParameters              | configParameters        | solutionParametersStr  | configParametersStr
    ${undefined}                    | ${someConfigParameter}  | ${'undefined'}         | ${'defined'}
    ${someSolutionParameter}        | ${null}                 | ${'defined'}           | ${'undefined'}
    ${someSolutionParameter}        | ${someConfigParameter}  | ${'defined'}           | ${'defined'}
  `('if solutionParameters is $solutionParametersStr and configParameters is $configParametersStr', (
    { solutionParameters, configParameters }) => {
    const res = ScenarioParametersUtils.getDefaultParametersValues(
      ['someParameter'], solutionParameters, configParameters);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
    expect(res).toStrictEqual({ someParameter: 'someDefaultValue' });
  });

  test('to get default values of zero parameters', () => {
    const res = ScenarioParametersUtils.getDefaultParametersValues([], someSolutionParameter, someConfigParameter);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
    expect(res).toStrictEqual({});
  });

  test('to get default values of several parameters', () => {
    const anotherConfigParameter = {
      parameter1: {
        defaultValue: 'defaultValue1'
      },
      parameter2: {
        defaultValue: 'defaultValue2'
      },
      parameter3: {
        defaultValue: 'defaultValue3'
      }
    };
    const res = ScenarioParametersUtils.getDefaultParametersValues(
      ['parameter1', 'parameter2', 'parameter3'], someSolutionParameter, anotherConfigParameter);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
    expect(res).toStrictEqual({
      parameter1: 'defaultValue1',
      parameter2: 'defaultValue2',
      parameter3: 'defaultValue3'
    });
  });

  test('to overwrite with config the default value defined in solution', () => {
    const anotherConfigParameter = {
      someParameter: {
        defaultValue: 'anotherDefaultValue'
      }
    };
    const res = ScenarioParametersUtils.getDefaultParametersValues(
      ['someParameter'], someSolutionParameter, anotherConfigParameter);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
    expect(res).toStrictEqual({ someParameter: 'anotherDefaultValue' });
  });

  test.each`
    parameterVarType  | expectedDefaultValue  | expectedWarningsNumber
    ${undefined}      | ${undefined}          | ${1}
    ${null}           | ${undefined}          | ${1}
    ${''}             | ${undefined}          | ${1}
    ${'enum'}         | ${null}               | ${0}
    ${'string'}       | ${''}                 | ${0}
    ${'int'}          | ${0}                  | ${0}
    ${'number'}       | ${0}                  | ${0}
    ${'bool'}         | ${false}              | ${0}
    ${'%DATASETID%'}  | ${null}               | ${0}
  `('to infer default value when varType is "$parameterVarType"', (
    { parameterVarType, expectedDefaultValue, expectedWarningsNumber }) => {
    const someSolutionParameterWithoutDefaultValue = [
      {
        id: 'someParameter',
        defaultValue: null,
        varType: parameterVarType
      }
    ];
    const res = ScenarioParametersUtils.getDefaultParametersValues(
      ['someParameter'], someSolutionParameterWithoutDefaultValue, null);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(expectedWarningsNumber);
    expect(res).toStrictEqual({ someParameter: expectedDefaultValue });
  });
});

describe('getParametersValuesForReset', () => {
  const datasets = [
    {
      id: 'dataset1',
      name: 'Dataset 1',
      description: 'Dataset description',
      ownerId: '00000000-0000-0000-0000-000000000000',
      fragmentsIds: null,
      validatorId: null,
      compatibility: null,
      tags: [],
      connector: {
        id: 'c-0000000000000',
        name: 'ADT Connector',
        version: '2.3.0',
        parametersValues: {
          AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/datasets/dataset1/dataset.csv'
        }
      }
    },
    {
      id: 'dataset2',
      name: 'Dataset 2',
      description: 'Dataset description',
      ownerId: '00000000-0000-0000-0000-000000000000',
      fragmentsIds: null,
      validatorId: null,
      compatibility: null,
      tags: [],
      connector: {
        id: 'c-0000000000000',
        name: 'ADT Connector',
        version: '2.3.0',
        parametersValues: {
          AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/datasets/dataset2/dataset.csv'
        }
      }
    },
    {
      id: 'dataset3',
      name: 'Dataset 3',
      description: 'Dataset description',
      ownerId: '00000000-0000-0000-0000-000000000000',
      fragmentsIds: null,
      validatorId: null,
      compatibility: null,
      tags: [],
      connector: {
        id: 'c-0000000000000',
        name: 'ADT Connector',
        version: '2.3.0',
        parametersValues: {
          AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/datasets/dataset3/dataset.csv'
        }
      }
    }
  ];
  const defaultParametersValues = {
    parameter1: 'defaultValue1',
    parameter2: 'defaultValue2',
    parameter3: 'defaultValue3'
  };
  const scenarioParametersValues = [
    {
      parameterId: 'parameter1',
      value: 'value1'
    },
    {
      parameterId: 'parameter2',
      value: 'value2'
    },
    {
      parameterId: 'parameter3',
      value: 'value3'
    }
  ];

  test('the scenario parameters values must overwrite the config default values', () => {
    const res = ScenarioParametersUtils.getParametersValuesForReset(
      datasets, ['parameter1', 'parameter2', 'parameter3'], defaultParametersValues, scenarioParametersValues);
    expect(res).toStrictEqual({
      parameter1: 'value1',
      parameter2: 'value2',
      parameter3: 'value3'
    });
  });

  test.each`
    defaultParametersValues
    ${undefined}
    ${null}
    ${[]}
  `('the scenario parameters values are used if defaultParametersValues is $defaultParametersValues', (
    { defaultParametersValues }) => {
    const res = ScenarioParametersUtils.getParametersValuesForReset(
      datasets, ['parameter1', 'parameter2', 'parameter3'], defaultParametersValues, scenarioParametersValues);
    expect(res).toStrictEqual({
      parameter1: 'value1',
      parameter2: 'value2',
      parameter3: 'value3'
    });
  });

  test.each`
    scenarioParametersValues
    ${undefined}
    ${null}
    ${[]}
  `('the default parameters values are used if scenarioParametersValues is $scenarioParametersValues', (
    { scenarioParametersValues }) => {
    const res = ScenarioParametersUtils.getParametersValuesForReset(
      datasets, ['parameter1', 'parameter2', 'parameter3'], defaultParametersValues, scenarioParametersValues);
    expect(res).toStrictEqual({
      parameter1: 'defaultValue1',
      parameter2: 'defaultValue2',
      parameter3: 'defaultValue3'
    });
  });

  test('an empty list is returned if there are no requested parameters', () => {
    const res = ScenarioParametersUtils.getParametersValuesForReset(
      datasets, [], defaultParametersValues, scenarioParametersValues);
    expect(res).toStrictEqual({});
  });
});

describe('buildParametersForUpdate', () => {
  let solution;
  beforeEach(() => {
    solution = clone(STANDARD_SOLUTION);
  });
  const runTemplateParametersIds = ['param1', 'param2'];
  const parametersValues = { param1: 'value1', param2: 'value2' };
  const expectedParametersForUpdate = [
    {
      parameterId: 'param1',
      value: 'value1',
      varType: 'int'
    },
    {
      parameterId: 'param2',
      value: 'value2',
      varType: 'string'
    }
  ];

  test('parameters for update are properly built from solution data and parameters values', () => {
    const res = ScenarioParametersUtils.buildParametersForUpdate(solution, parametersValues, runTemplateParametersIds);
    expect(res).toStrictEqual(expectedParametersForUpdate);
  });
});
