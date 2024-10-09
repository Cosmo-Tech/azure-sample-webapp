// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { RunnersUtils } from '../RunnersUtils';

describe('patchScenarioParameterValues', () => {
  test.each`
    solutionParameters | parameterValues
    ${undefined}       | ${undefined}
    ${undefined}       | ${null}
    ${undefined}       | ${[]}
    ${undefined}       | ${0}
    ${undefined}       | ${false}
    ${undefined}       | ${''}
    ${undefined}       | ${'foo'}
    ${null}            | ${undefined}
    ${null}            | ${null}
    ${null}            | ${[]}
    ${null}            | ${0}
    ${null}            | ${false}
    ${null}            | ${''}
    ${null}            | ${'foo'}
    ${[]}              | ${undefined}
    ${[]}              | ${null}
    ${[]}              | ${[]}
    ${[]}              | ${0}
    ${[]}              | ${false}
    ${[]}              | ${''}
    ${[]}              | ${'foo'}
  `(
    'should do nothing without error when arguments are nullish or not arrays',
    ({ solutionParameters, parameterValues }) => {
      expect(() => RunnersUtils.patchRunnerParameterValues(solutionParameters, parameterValues)).not.toThrow();
    }
  );

  test('should fill missing varTypes based on solution description', () => {
    const spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const solutionParameters = [
      { id: 'p0', varType: 'bool' },
      { id: 'p1', varType: 'date' },
      { id: 'p3', varType: 'string' },
    ];
    const parameterValues = [
      { parameterId: 'p0', value: 'p0' },
      { parameterId: 'p1', varType: null, value: 'p1' },
      { parameterId: 'p2', varType: null, value: 'p2' },
      { parameterId: 'p3', varType: 'string', value: 'p3' },
    ];
    const expectedParameterValues = [
      { parameterId: 'p0', varType: 'bool', value: 'p0' },
      { parameterId: 'p1', varType: 'date', value: 'p1' },
      { parameterId: 'p2', varType: null, value: 'p2' }, // Not defined in solution
      { parameterId: 'p3', varType: 'string', value: 'p3' },
    ];

    RunnersUtils.patchRunnerParameterValues(solutionParameters, parameterValues);
    expect(parameterValues).toStrictEqual(expectedParameterValues);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);

    spyConsoleWarn.mockClear();
  });
});

describe('update parentId on delete', () => {
  test('can update parentId if parent has been deleted', () => {
    const runners = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-1' },
      { id: 'r-3', parentId: 'r-2' },
    ];
    const runnersAfterUpdate = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-1' },
      { id: 'r-3', parentId: 'r-1' },
    ];
    RunnersUtils.updateParentIdOnDelete(runners, 'r-2');
    expect(runners).toStrictEqual(runnersAfterUpdate);
  });
  test('can assign parentId to null if no higher parents', () => {
    const runners = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-1' },
      { id: 'r-3', parentId: 'r-1' },
    ];
    const runnersAfterUpdate = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: null },
      { id: 'r-3', parentId: null },
    ];
    RunnersUtils.updateParentIdOnDelete(runners, 'r-1');
    expect(runners).toStrictEqual(runnersAfterUpdate);
  });
  test("doesn't update array if no children scenarios", () => {
    const runners = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-1' },
      { id: 'r-3', parentId: null },
    ];
    const runnersAfterUpdate = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-1' },
      { id: 'r-3', parentId: null },
    ];
    RunnersUtils.updateParentIdOnDelete(runners, 'r-3');
    expect(runners).toStrictEqual(runnersAfterUpdate);
  });
  test('can update parentId in nested tree', () => {
    const runners = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-1' },
      { id: 'r-3', parentId: 'r-2' },
      { id: 'r-4', parentId: 'r-3' },
      { id: 'r-5', parentId: 'r-4' },
    ];
    const runnersAfterUpdate = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-1' },
      { id: 'r-3', parentId: 'r-2' },
      { id: 'r-4', parentId: 'r-2' },
      { id: 'r-5', parentId: 'r-4' },
    ];
    RunnersUtils.updateParentIdOnDelete(runners, 'r-3');
    expect(runners).toStrictEqual(runnersAfterUpdate);
  });
  test('can update parentId in large tree', () => {
    const runners = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-1' },
      { id: 'r-3', parentId: 'r-2' },
      { id: 'r-4', parentId: 'r-2' },
      { id: 'r-5', parentId: 'r-2' },
      { id: 'r-6', parentId: 'r-1' },
    ];
    const runnersAfterUpdate = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-1' },
      { id: 'r-3', parentId: 'r-1' },
      { id: 'r-4', parentId: 'r-1' },
      { id: 'r-5', parentId: 'r-1' },
      { id: 'r-6', parentId: 'r-1' },
    ];
    RunnersUtils.updateParentIdOnDelete(runners, 'r-2');
    expect(runners).toStrictEqual(runnersAfterUpdate);
  });
  test("can update parentId if target scenario isn't in the list", () => {
    const runners = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-4' },
      { id: 'r-3', parentId: 'r-2' },
    ];
    const runnersAfterUpdate = [
      { id: 'r-1', parentId: null },
      { id: 'r-2', parentId: 'r-4' },
      { id: 'r-3', parentId: 'r-4' },
    ];
    RunnersUtils.updateParentIdOnDelete(runners, 'r-2');
    expect(runners).toStrictEqual(runnersAfterUpdate);
  });
});
