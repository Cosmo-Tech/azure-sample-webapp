// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { ScenarioParametersUtils } from '../scenarioParameters/ScenarioParametersUtils';
import { STANDARD_DATASETS } from './fixtures/StandardDatasetsData';
import { STANDARD_SOLUTION } from './fixtures/StandardSolutionData';

const clone = rfdc();

const getParamDataFromStandardSolution = (parameterId) => {
  return STANDARD_SOLUTION.parameters.find((param) => param.id === parameterId);
};

describe('generateParametersMetadata with missing data in solution', () => {
  let solution;
  let spyConsoleWarn;

  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyConsoleWarn.mockClear();
  });

  beforeEach(() => {
    solution = clone(STANDARD_SOLUTION);
  });

  const expectedParametersMetadata = {
    param1: getParamDataFromStandardSolution('param1'),
    param2: getParamDataFromStandardSolution('param2'),
  };

  test.each`
    field                | fieldValue   | expectedWarnings | expectedRes
    ${'runTemplates'}    | ${undefined} | ${0}             | ${expectedParametersMetadata}
    ${'runTemplates'}    | ${null}      | ${0}             | ${expectedParametersMetadata}
    ${'runTemplates'}    | ${[]}        | ${0}             | ${expectedParametersMetadata}
    ${'parameterGroups'} | ${undefined} | ${0}             | ${expectedParametersMetadata}
    ${'parameterGroups'} | ${null}      | ${0}             | ${expectedParametersMetadata}
    ${'parameterGroups'} | ${[]}        | ${0}             | ${expectedParametersMetadata}
    ${'parameters'}      | ${undefined} | ${2}             | ${{}}
    ${'parameters'}      | ${null}      | ${2}             | ${{}}
    ${'parameters'}      | ${[]}        | ${2}             | ${{}}
  `('if $field is $fieldValue', ({ field, fieldValue, expectedWarnings, expectedRes }) => {
    solution[field] = fieldValue;
    const res = ScenarioParametersUtils.generateParametersMetadata(solution, ['param1', 'param2']);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(expectedWarnings);
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
    const res = ScenarioParametersUtils.generateParametersMetadata(solution, ['param1', 'param2']);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(2);
    expect(res).toStrictEqual({});
  });
});

describe('generateParametersGroupsMetadata with missing data in solution', () => {
  let solution;
  let spyConsoleWarn;

  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyConsoleWarn.mockClear();
  });

  beforeEach(() => {
    solution = clone(STANDARD_SOLUTION);
  });

  const expectedGroupsDataForRunTemplate1WhenNoParameters = [
    {
      id: 'groupA',
      labels: {
        en: 'GroupA EN label',
        fr: 'GroupA FR label',
      },
      parameters: [],
      options: {
        authorizedRoles: [],
        hideParameterGroupIfNoPermission: false,
      },
    },
  ];

  test.each`
    field                | fieldValue   | expectedRes
    ${'runTemplates'}    | ${undefined} | ${[]}
    ${'runTemplates'}    | ${null}      | ${[]}
    ${'runTemplates'}    | ${[]}        | ${[]}
    ${'parameterGroups'} | ${undefined} | ${[]}
    ${'parameterGroups'} | ${null}      | ${[]}
    ${'parameterGroups'} | ${[]}        | ${[]}
    ${'parameters'}      | ${undefined} | ${expectedGroupsDataForRunTemplate1WhenNoParameters}
    ${'parameters'}      | ${null}      | ${expectedGroupsDataForRunTemplate1WhenNoParameters}
    ${'parameters'}      | ${[]}        | ${expectedGroupsDataForRunTemplate1WhenNoParameters}
  `('if $field is $fieldValue', ({ field, fieldValue, expectedRes }) => {
    solution[field] = fieldValue;
    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, 'runTemplate1');
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
    const res = ScenarioParametersUtils.generateParametersGroupsMetadata(solution, 'runTemplate1');
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
    expect(res).toStrictEqual([]);
  });
});

describe('getDefaultParametersValues with empty solution', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyConsoleWarn.mockClear();
  });

  test.each`
    solutionParameters
    ${undefined}
    ${null}
    ${[]}
  `('if solutionParameters is $solutionParameters', ({ solutionParameters }) => {
    const res = ScenarioParametersUtils.getDefaultParametersValues(['unknownParameter'], solutionParameters);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
    expect(res).toStrictEqual({ unknownParameter: undefined });
  });
});

describe('getDefaultParametersValues with solution', () => {
  let spyConsoleWarn;
  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyConsoleWarn.mockClear();
  });

  const someSolutionParameter = [
    {
      id: 'someParameter',
      defaultValue: 'someDefaultValue',
    },
  ];

  test.each`
    solutionParameters       | solutionParametersStr | expectedDefaultValue  | expectedWarningsNumber
    ${undefined}             | ${'undefined'}        | ${undefined}          | ${1}
    ${someSolutionParameter} | ${'defined'}          | ${'someDefaultValue'} | ${0}
  `(
    'if solutionParameters is $solutionParametersStr',
    ({ solutionParameters, expectedDefaultValue, expectedWarningsNumber }) => {
      const res = ScenarioParametersUtils.getDefaultParametersValues(['someParameter'], solutionParameters);
      expect(spyConsoleWarn).toHaveBeenCalledTimes(expectedWarningsNumber);
      expect(res).toStrictEqual({ someParameter: expectedDefaultValue });
    }
  );

  test('to get default values with no parameters provided', () => {
    const res = ScenarioParametersUtils.getDefaultParametersValues([], someSolutionParameter);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
    expect(res).toStrictEqual({});
  });

  test('to get default values of several parameters not in solution', () => {
    const res = ScenarioParametersUtils.getDefaultParametersValues(
      ['parameter1', 'parameter2', 'parameter3'],
      someSolutionParameter
    );
    expect(spyConsoleWarn).toHaveBeenCalledTimes(3);
    expect(res).toStrictEqual({
      parameter1: undefined,
      parameter2: undefined,
      parameter3: undefined,
    });
  });

  test('to overwrite with config the default value defined in solution', () => {
    const res = ScenarioParametersUtils.getDefaultParametersValues(['someParameter'], someSolutionParameter);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
    expect(res).toStrictEqual({ someParameter: 'someDefaultValue' });
  });

  test.each`
    parameterVarType | expectedDefaultValue | expectedWarningsNumber
    ${undefined}     | ${undefined}         | ${1}
    ${null}          | ${undefined}         | ${1}
    ${''}            | ${undefined}         | ${1}
    ${'enum'}        | ${null}              | ${0}
    ${'string'}      | ${''}                | ${0}
    ${'int'}         | ${0}                 | ${0}
    ${'number'}      | ${0}                 | ${0}
    ${'bool'}        | ${false}             | ${0}
    ${'%DATASETID%'} | ${null}              | ${0}
  `(
    'to infer default value when varType is "$parameterVarType"',
    ({ parameterVarType, expectedDefaultValue, expectedWarningsNumber }) => {
      const someSolutionParameterWithoutDefaultValue = [
        {
          id: 'someParameter',
          defaultValue: null,
          varType: parameterVarType,
        },
      ];
      const res = ScenarioParametersUtils.getDefaultParametersValues(
        ['someParameter'],
        someSolutionParameterWithoutDefaultValue
      );
      expect(spyConsoleWarn).toHaveBeenCalledTimes(expectedWarningsNumber);
      expect(res).toStrictEqual({ someParameter: expectedDefaultValue });
    }
  );
});

describe('getParametersValuesForReset', () => {
  const defaultParametersValues = {
    parameter1: 'defaultValue1',
    parameter2: 'defaultValue2',
    parameter3: 'defaultValue3',
  };
  const scenarioParametersValues = [
    {
      parameterId: 'parameter1',
      value: 'value1',
    },
    {
      parameterId: 'parameter2',
      value: 'value2',
    },
    {
      parameterId: 'parameter3',
      value: 'value3',
    },
  ];

  test('the scenario parameters values must overwrite the config default values', () => {
    const res = ScenarioParametersUtils.getParametersValuesForReset(
      STANDARD_DATASETS,
      ['parameter1', 'parameter2', 'parameter3'],
      defaultParametersValues,
      scenarioParametersValues
    );
    expect(res).toStrictEqual({
      parameter1: 'value1',
      parameter2: 'value2',
      parameter3: 'value3',
    });
  });

  test.each`
    defaultParametersValues
    ${undefined}
    ${null}
    ${[]}
  `(
    'the scenario parameters values are used if defaultParametersValues is $defaultParametersValues',
    ({ defaultParametersValues }) => {
      const res = ScenarioParametersUtils.getParametersValuesForReset(
        STANDARD_DATASETS,
        ['parameter1', 'parameter2', 'parameter3'],
        defaultParametersValues,
        scenarioParametersValues
      );
      expect(res).toStrictEqual({
        parameter1: 'value1',
        parameter2: 'value2',
        parameter3: 'value3',
      });
    }
  );

  test.each`
    scenarioParametersValues
    ${undefined}
    ${null}
    ${[]}
  `(
    'the default parameters values are used if scenarioParametersValues is $scenarioParametersValues',
    ({ scenarioParametersValues }) => {
      const res = ScenarioParametersUtils.getParametersValuesForReset(
        STANDARD_DATASETS,
        ['parameter1', 'parameter2', 'parameter3'],
        defaultParametersValues,
        scenarioParametersValues
      );
      expect(res).toStrictEqual({
        parameter1: 'defaultValue1',
        parameter2: 'defaultValue2',
        parameter3: 'defaultValue3',
      });
    }
  );

  test('an empty list is returned if there are no requested parameters', () => {
    const res = ScenarioParametersUtils.getParametersValuesForReset(
      STANDARD_DATASETS,
      [],
      defaultParametersValues,
      scenarioParametersValues
    );
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
      varType: 'int',
    },
    {
      parameterId: 'param2',
      value: 'value2',
      varType: 'string',
    },
  ];

  test('parameters for update are properly built from solution data and parameters values', () => {
    const res = ScenarioParametersUtils.buildParametersForUpdate(solution, parametersValues, runTemplateParametersIds);
    expect(res).toStrictEqual(expectedParametersForUpdate);
  });
});

describe('getParameterVarType', () => {
  test.each`
    parameterId         | expectedVarType
    ${'param1'}         | ${'int'}
    ${'param2'}         | ${'string'}
    ${'dataset_param1'} | ${'%DATASETID%'}
  `('that parameter $parameterId is of varType $expectedVarType', ({ parameterId, expectedVarType }) => {
    const res = ScenarioParametersUtils.getParameterVarType(STANDARD_SOLUTION, parameterId);
    expect(res).toStrictEqual(expectedVarType);
  });
});

describe('get errors count by tab', () => {
  const tabs = [
    {
      id: 'bar_parameters',
      parameters: [{ id: 'stock' }, { id: 'restock_qty' }, { id: 'nb_waiters' }],
    },
    {
      id: 'basic_types',
      parameters: [
        { id: 'currency' },
        { id: 'currency_name' },
        { id: 'currency_value' },
        { id: 'currency_used' },
        { id: 'start_date' },
        { id: 'average_consumption' },
      ],
    },
    {
      id: 'additional_parameters',
      parameters: [{ id: 'volume_unit' }, { id: 'additional_tables' }, { id: 'comment' }, { id: 'additional_date' }],
    },
  ];
  const tabsWithNoParameters = [
    {
      id: 'bar_parameters',
    },
    {
      id: 'basic_types',
    },
    {
      id: 'additional_parameters',
    },
  ];

  const errors = {
    additional_tables: {
      type: 'required',
      message: 'This field is required',
    },
    currency: {
      type: 'required',
      message: 'This field is required',
    },
    stock: {
      type: 'required',
      message: 'This field is required',
    },
    comment: {
      type: 'required',
      message: 'This field is required',
    },
    start_date: {
      type: 'required',
      message: 'This field is required',
    },
    average_consumption: {
      type: 'required',
      message: 'This field is required',
    },
  };

  const errorsWithAdditionalParameter = {
    additional_tables: {
      type: 'required',
      message: 'This field is required',
    },
    currency: {
      type: 'required',
      message: 'This field is required',
    },
    stock: {
      type: 'required',
      message: 'This field is required',
    },
    comment: {
      type: 'required',
      message: 'This field is required',
    },
    start_date: {
      type: 'required',
      message: 'This field is required',
    },
    average_consumption: {
      type: 'required',
      message: 'This field is required',
    },
    customers: {
      type: 'required',
      message: 'This field is required',
    },
  };

  const errorsCount = {
    bar_parameters: 1,
    basic_types: 3,
    additional_parameters: 2,
  };
  const errorsCountZero = {
    bar_parameters: 0,
    basic_types: 0,
    additional_parameters: 0,
  };
  test.each`
    tabs                    | errors                           | errorsCount
    ${tabs}                 | ${errors}                        | ${errorsCount}
    ${tabs}                 | ${{}}                            | ${errorsCountZero}
    ${tabs}                 | ${undefined}                     | ${errorsCountZero}
    ${tabsWithNoParameters} | ${{}}                            | ${errorsCountZero}
    ${tabsWithNoParameters} | ${errors}                        | ${errorsCountZero}
    ${tabs}                 | ${errorsWithAdditionalParameter} | ${errorsCount}
  `('errorsCount object is correctly created', ({ tabs, errors, errorsCount }) => {
    const res = ScenarioParametersUtils.getErrorsCountByTab(tabs, errors);
    expect(res).toStrictEqual(errorsCount);
  });
});
