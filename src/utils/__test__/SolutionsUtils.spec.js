// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SolutionsUtils } from '../SolutionsUtils';

describe('addTranslationLabels', () => {
  test('from an undefined solution', () => {
    expect(SolutionsUtils.addTranslationLabels(undefined)).toBe(undefined);
  });

  test('from an empty solution', () => {
    expect(SolutionsUtils.addTranslationLabels({})).toBe(undefined);
  });

  test('from a solution with an empty list of parameters', () => {
    expect(SolutionsUtils.addTranslationLabels({ parameters: [] })).toBe(undefined);
  });

  test('from a solution with an empty list of parameters groups', () => {
    expect(SolutionsUtils.addTranslationLabels({ parameterGroups: [] })).toBe(undefined);
  });
});

describe('addRunTemplatesParametersIdsDict for a minimal or incomplete solution', () => {
  test('if solution is undefined', () => {
    const solution = undefined;
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution);
    expect(solution).toBe(undefined);
  });

  test('if solution is null', () => {
    const solution = null;
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution);
    expect(solution).toBe(null);
  });

  test('if solution is empty', () => {
    const solution = {};
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution);
    expect(solution).toStrictEqual({ runTemplatesParametersIdsDict: {} });
  });

  test('if solution parameters are null', () => {
    const solution = { parameters: null };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution);
    expect(solution).toStrictEqual({
      parameters: null,
      runTemplatesParametersIdsDict: {},
    });
  });

  test('if solution parameterGroups are null', () => {
    const solution = { parameterGroups: null };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution);
    expect(solution).toStrictEqual({
      parameterGroups: null,
      runTemplatesParametersIdsDict: {},
    });
  });

  test('if solution runTemplates are null', () => {
    const solution = { runTemplates: null };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution);
    expect(solution).toStrictEqual({
      runTemplates: null,
      runTemplatesParametersIdsDict: {},
    });
  });

  test('if solution parameters, parameterGroups and runTemplates are null', () => {
    const solution = {
      parameters: null,
      parameterGroups: null,
      runTemplates: null,
    };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution);
    expect(solution).toStrictEqual({
      parameters: null,
      parameterGroups: null,
      runTemplates: null,
      runTemplatesParametersIdsDict: {},
    });
  });

  test('if solution parameters and parameterGroups are empty', () => {
    const solution = {
      parameters: [],
      parameterGroups: [],
    };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution);
    expect(solution).toStrictEqual({
      parameters: [],
      parameterGroups: [],
      runTemplatesParametersIdsDict: {},
    });
  });
  test('if parameters constraints are valid', () => {
    const spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    const solution = {
      parameters: [
        {
          id: 'parameter1',
          varType: 'int',
          options: {
            validation: '> parameter2',
          },
        },
        {
          id: 'parameter2',
          varType: 'int',
          options: null,
        },
      ],
    };
    SolutionsUtils.checkParametersValidationConstraintsInSolution(solution);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
  });
  test('if parameters constraints are not valid', () => {
    const spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    const solution = {
      parameters: [
        {
          id: 'parameter1',
          varType: 'int',
          options: {
            validation: '> parameter2',
          },
        },
        {
          id: 'parameter2',
          varType: 'string',
          options: null,
        },
      ],
    };
    SolutionsUtils.checkParametersValidationConstraintsInSolution(solution);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.stringContaining('> parameter2'));
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.stringContaining('cannot be applied'));
    spyConsoleWarn.mockReset();
  });
});

describe('patchIncompatibleValuesInSolution function unit tests', () => {
  const TABLE_PARAMETER = {
    varType: '%DATASETID%',
    options: {
      canChangeRowsNumber: false,
      subType: 'TABLE',
      columns: [
        {
          field: 'name',
          type: ['nonResizable', 'nonSortable'],
          defaultValue: 'TKT',
        },
        {
          field: 'age',
          type: ['int'],
          minValue: 0,
          maxValue: 120,
          acceptsEmptyFields: true,
        },
      ],
    },
  };
  const PARAMETER_LIST = {
    parameters: [TABLE_PARAMETER],
  };
  const PARAMETER_LIST_WITH_ADD_ROW = {
    parameters: [{ ...TABLE_PARAMETER, options: { ...TABLE_PARAMETER.options, canChangeRowsNumber: true } }],
  };
  const PARAMETER_LIST_WITH_NON_EDITABLE_COLUMN = {
    parameters: [
      {
        ...TABLE_PARAMETER,
        options: {
          ...TABLE_PARAMETER.options,
          columns: [
            {
              field: 'name',
              type: ['nonResizable', 'nonSortable', 'nonEditable'],
              defaultValue: 'TKT',
            },
            { ...TABLE_PARAMETER.options.columns[1] },
          ],
        },
      },
    ],
  };
  const PARAMETER_LIST_WITH_ALL_FEATURES = {
    parameters: [
      {
        ...TABLE_PARAMETER,
        options: {
          ...TABLE_PARAMETER.options,
          canChangeRowsNumber: true,
          columns: [
            {
              field: 'name',
              type: ['nonResizable', 'nonSortable', 'nonEditable'],
              defaultValue: 'TKT',
            },
            { ...TABLE_PARAMETER.options.columns[1] },
            {},
            null,
            undefined,
          ],
        },
      },
    ],
  };

  test.each`
    parameters                                 | expected | warnCount
    ${PARAMETER_LIST}                          | ${false} | ${0}
    ${PARAMETER_LIST_WITH_ADD_ROW}             | ${true}  | ${0}
    ${PARAMETER_LIST_WITH_NON_EDITABLE_COLUMN} | ${false} | ${0}
    ${PARAMETER_LIST_WITH_ALL_FEATURES}        | ${false} | ${1}
  `('parse $parameters and fix it to get a good parameter list as $expected', ({ parameters, expected, warnCount }) => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    SolutionsUtils.patchIncompatibleValuesInSolution(parameters);
    expect(parameters.parameters[0].options.canChangeRowsNumber).toStrictEqual(expected);
    expect(warn).toHaveBeenCalledTimes(warnCount);
    warn.mockReset();
  });

  test.each`
    parameters
    ${null}
    ${undefined}
    ${[]}
  `('should not fail when parameters are $parameters', ({ parameters }) => {
    const solution = { parameters };
    expect(() => SolutionsUtils.patchIncompatibleValuesInSolution(solution)).not.toThrow();
  });
});
