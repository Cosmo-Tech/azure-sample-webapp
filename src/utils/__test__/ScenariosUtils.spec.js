// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ScenariosUtils } from '../ScenariosUtils';

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
      expect(() => ScenariosUtils.patchScenarioParameterValues(solutionParameters, parameterValues)).not.toThrow();
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

    ScenariosUtils.patchScenarioParameterValues(solutionParameters, parameterValues);
    expect(parameterValues).toStrictEqual(expectedParameterValues);
    expect(spyConsoleWarn).toHaveBeenCalledTimes(1);

    spyConsoleWarn.mockClear();
  });
});
