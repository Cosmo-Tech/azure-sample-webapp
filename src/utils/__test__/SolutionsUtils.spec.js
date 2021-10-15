// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';
import { SolutionsUtils } from '../SolutionsUtils';
import { STANDARD_SOLUTION } from './StandardSolutionData';

const clone = rfdc();

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
  const emptyConfig = {};
  test('if solution is undefined', () => {
    const solution = undefined;
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, emptyConfig);
    expect(solution).toBe(undefined);
  });

  test('if solution is null', () => {
    const solution = null;
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, emptyConfig);
    expect(solution).toBe(null);
  });

  test('if solution is empty', () => {
    const solution = {};
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, emptyConfig);
    expect(solution).toStrictEqual({ runTemplatesParametersIdsDict: {} });
  });

  test('if solution parameters are null', () => {
    const solution = { parameters: null };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, emptyConfig);
    expect(solution).toStrictEqual({
      parameters: null,
      runTemplatesParametersIdsDict: {}
    });
  });

  test('if solution parameterGroups are null', () => {
    const solution = { parameterGroups: null };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, emptyConfig);
    expect(solution).toStrictEqual({
      parameterGroups: null,
      runTemplatesParametersIdsDict: {}
    });
  });

  test('if solution runTemplates are null', () => {
    const solution = { runTemplates: null };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, emptyConfig);
    expect(solution).toStrictEqual({
      runTemplates: null,
      runTemplatesParametersIdsDict: {}
    });
  });

  test('if solution parameters, parameterGroups and runTemplates are null', () => {
    const solution = {
      parameters: null,
      parameterGroups: null,
      runTemplates: null
    };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, emptyConfig);
    expect(solution).toStrictEqual({
      parameters: null,
      parameterGroups: null,
      runTemplates: null,
      runTemplatesParametersIdsDict: {}
    });
  });

  test('if solution parameters and parameterGroups are empty', () => {
    const solution = {
      parameters: [],
      parameterGroups: []
    };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, emptyConfig);
    expect(solution).toStrictEqual({
      parameters: [],
      parameterGroups: [],
      runTemplatesParametersIdsDict: {}
    });
  });
});

describe('addRunTemplatesParametersIdsDict for a minimal or incomplete config', () => {
  let solution;
  beforeEach(() => {
    solution = clone(STANDARD_SOLUTION);
  });

  const expectedModifiedSolution = {
    ...STANDARD_SOLUTION,
    runTemplatesParametersIdsDict: {
      runTemplate1: ['param1'],
      runTemplate2: ['param1', 'param2'],
      runTemplate3: ['param1', 'param2']
    }
  };

  test.each`
    config
    ${undefined}
    ${null}
    ${{}}
  `('if config is $config', ({ config }) => {
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, config);
    expect(solution).toStrictEqual(expectedModifiedSolution);
  });

  test.each`
    dataValue
    ${undefined}
    ${null}
    ${{}}
  `('with $dataValue data', ({ dataValue }) => {
    const config = {
      parameters: dataValue,
      parametersGroups: dataValue,
      runTemplates: dataValue
    };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, config);
    expect(solution).toStrictEqual(expectedModifiedSolution);
  });
});

describe('addRunTemplatesParametersIdsDict with config overwrite', () => {
  let solution;
  beforeEach(() => {
    solution = clone(STANDARD_SOLUTION);
  });

  test('of a parameter replaced by another one in an existing group', () => {
    const config = {
      parameters: {},
      parametersGroups: {
        groupA: {
          parameters: [
            'param2'
          ]
        }
      },
      runTemplates: {}
    };

    const expectedRunTemplatesParametersIdsDict = {
      runTemplate1: [
        'param2'
      ],
      runTemplate2: [
        'param2'
      ],
      runTemplate3: [
        'param1',
        'param2'
      ]
    };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, config);
    expect(solution.runTemplatesParametersIdsDict).toStrictEqual(expectedRunTemplatesParametersIdsDict);
  });

  test('of a parameter group replaced by another one in an existing run template', () => {
    const config = {
      parameters: {},
      parametersGroups: {},
      runTemplates: {
        runTemplate3: {
          parameterGroups: [
            'groupA'
          ]
        }
      }
    };

    const expectedRunTemplatesParametersIdsDict = {
      runTemplate1: [
        'param1'
      ],
      runTemplate2: [
        'param1',
        'param2'
      ],
      runTemplate3: [
        'param1'
      ]

    };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, config);
    expect(solution.runTemplatesParametersIdsDict).toStrictEqual(expectedRunTemplatesParametersIdsDict);
  });

  test('to add a new parameter in an existing group', () => {
    const config = {
      parameters: {},
      parametersGroups: {
        groupA: {
          parameters: [
            'param1',
            'newParam'
          ]
        }
      },
      runTemplates: {}
    };

    const expectedRunTemplatesParametersIdsDict = {
      runTemplate1: [
        'param1',
        'newParam'
      ],
      runTemplate2: [
        'param1',
        'newParam',
        'param2'
      ],
      runTemplate3: [
        'param1',
        'param2'
      ]
    };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, config);
    expect(solution.runTemplatesParametersIdsDict).toStrictEqual(expectedRunTemplatesParametersIdsDict);
  });

  test('to add a new run template', () => {
    const config = {
      parameters: {},
      parametersGroups: {},
      runTemplates: {
        newRunTemplate: {
          parameterGroups: [
            'groupB'
          ]
        }
      }
    };

    const expectedRunTemplatesParametersIdsDict = {
      runTemplate1: [
        'param1'
      ],
      runTemplate2: [
        'param1',
        'param2'
      ],
      runTemplate3: [
        'param1',
        'param2'
      ],
      newRunTemplate: [
        'param2'
      ]
    };
    SolutionsUtils.addRunTemplatesParametersIdsDict(solution, config);
    expect(solution.runTemplatesParametersIdsDict).toStrictEqual(expectedRunTemplatesParametersIdsDict);
  });
});
