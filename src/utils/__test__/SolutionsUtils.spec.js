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
