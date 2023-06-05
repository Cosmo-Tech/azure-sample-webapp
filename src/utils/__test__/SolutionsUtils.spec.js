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
});

describe('fixNotCompatibleValuesInSolution function unit tests', () => {
  const PARAMETER_LIST = {
    parameters: [
      {
        varType: '%DATASETID%',
        options: {
          enableAddRow: false,
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
      },
    ],
  };
  const PARAMETER_LIST_WITH_ADD_ROW = {
    parameters: [
      { ...PARAMETER_LIST.parameters[0], options: { ...PARAMETER_LIST.parameters[0].options, enableAddRow: true } },
    ],
  };
  const PARAMETER_LIST_WITH_NON_EDITABLE_COLUMN = {
    parameters: [
      {
        ...PARAMETER_LIST.parameters[0],
        options: {
          ...PARAMETER_LIST.parameters[0].options,
          columns: [
            {
              field: 'name',
              type: ['nonResizable', 'nonSortable', 'nonEditable'],
              defaultValue: 'TKT',
            },
            { ...PARAMETER_LIST.parameters[0].options.columns[1] },
          ],
        },
      },
    ],
  };
  const PARAMETER_LIST_WITH_ADD_ROW_AND_NON_EDITABLE_COLUMN = {
    parameters: [
      {
        ...PARAMETER_LIST.parameters[0],
        options: {
          ...PARAMETER_LIST.parameters[0].options,
          enableAddRow: true,
          columns: [
            {
              field: 'name',
              type: ['nonResizable', 'nonSortable', 'nonEditable'],
              defaultValue: 'TKT',
            },
            { ...PARAMETER_LIST.parameters[0].options.columns[1] },
          ],
        },
      },
    ],
  };

  test.each`
    parameters                                             | expected                                   | warnCount
    ${PARAMETER_LIST}                                      | ${PARAMETER_LIST}                          | ${0}
    ${PARAMETER_LIST_WITH_ADD_ROW}                         | ${PARAMETER_LIST_WITH_ADD_ROW}             | ${0}
    ${PARAMETER_LIST_WITH_NON_EDITABLE_COLUMN}             | ${PARAMETER_LIST_WITH_NON_EDITABLE_COLUMN} | ${0}
    ${PARAMETER_LIST_WITH_ADD_ROW_AND_NON_EDITABLE_COLUMN} | ${PARAMETER_LIST_WITH_NON_EDITABLE_COLUMN} | ${1}
  `('parse $parameters and fix it to get a good parameter list as $expected', ({ parameters, expected, warnCount }) => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    SolutionsUtils.fixNotCompatibleValuesInSolution(parameters);
    expect(parameters).toStrictEqual(expected);
    expect(warn).toHaveBeenCalledTimes(warnCount);
    warn.mockReset();
  });
});
