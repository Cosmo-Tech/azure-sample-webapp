// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ConfigUtils } from '../ConfigUtils';

describe('buildCompleteExtendedVarType with possible values', () => {
  test.each`
    varType      | extension      | expectedRes
    ${null}      | ${null}        | ${undefined}
    ${null}      | ${undefined}   | ${undefined}
    ${null}      | ${''}          | ${undefined}
    ${null}      | ${'extension'} | ${undefined}
    ${''}        | ${null}        | ${undefined}
    ${''}        | ${undefined}   | ${undefined}
    ${''}        | ${''}          | ${undefined}
    ${''}        | ${'extension'} | ${undefined}
    ${'varType'} | ${null}        | ${'varType'}
    ${'varType'} | ${undefined}   | ${'varType'}
    ${'varType'} | ${''}          | ${'varType'}
    ${'varType'} | ${'extension'} | ${'varType-extension'}
  `('if "$varType" and "$extension" then "$expectedRes"', ({ varType, extension, expectedRes }) => {
    const res = ConfigUtils.buildCompleteExtendedVarType(varType, extension);
    expect(res).toStrictEqual(expectedRes);
  });
});

describe('getConversionMethod with possible values', () => {
  let spyConsoleWarn;

  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });
  afterAll(() => {
    spyConsoleWarn.mockRestore();
  });

  function mockMethod(param) {
    return param;
  }

  function mockMethod2(param) {
    return param;
  }

  const arrayWithoutTypes = { noConversionMethod: true };
  const arrayWithVarType = { varType: mockMethod };
  const arrayWithExtendedVarType = { extended: mockMethod2 };
  const arrayWithBoth = { varType: mockMethod, extended: mockMethod2 };

  test.each`
    param                      | extendedVarType | functionArray               | consoleWarnCalls | expectedRes
    ${null}                    | ${null}         | ${null}                     | ${1}             | ${undefined}
    ${undefined}               | ${undefined}    | ${undefined}                | ${1}             | ${undefined}
    ${{}}                      | ${undefined}    | ${undefined}                | ${1}             | ${undefined}
    ${{}}                      | ${null}         | ${null}                     | ${1}             | ${undefined}
    ${{}}                      | ${''}           | ${null}                     | ${1}             | ${undefined}
    ${{}}                      | ${'extended'}   | ${null}                     | ${1}             | ${undefined}
    ${{ noVarType: true }}     | ${undefined}    | ${null}                     | ${1}             | ${undefined}
    ${{ noVarType: true }}     | ${null}         | ${null}                     | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}         | ${null}                     | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}    | ${null}                     | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}         | ${undefined}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}    | ${undefined}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}         | ${[]}                       | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}    | ${[]}                       | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}         | ${{}}                       | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}    | ${{}}                       | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}         | ${arrayWithoutTypes}        | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}    | ${arrayWithoutTypes}        | ${1}             | ${undefined}
    ${{ varType: 'varType2' }} | ${null}         | ${arrayWithVarType}         | ${1}             | ${undefined}
    ${{ varType: 'varType2' }} | ${undefined}    | ${arrayWithVarType}         | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${'extended'}   | ${arrayWithoutTypes}        | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${''}           | ${arrayWithoutTypes}        | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}         | ${arrayWithVarType}         | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${undefined}    | ${arrayWithVarType}         | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'}   | ${arrayWithVarType}         | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${''}           | ${arrayWithVarType}         | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'}   | ${arrayWithExtendedVarType} | ${0}             | ${mockMethod2}
    ${{ varType: 'varType' }}  | ${'extended'}   | ${arrayWithBoth}            | ${0}             | ${mockMethod2}
  `(
    'if param "$param",extendedVarType "$extendedVarType", functionArray "$functionArray"  ' +
      'and consoleWarnCalls "$consoleWarnCalls" then expectedRes "$expectedRes"',
    ({ param, extendedVarType, functionArray, consoleWarnCalls, expectedRes }) => {
      const res = ConfigUtils.getConversionMethod(param, extendedVarType, functionArray);
      expect(spyConsoleWarn).toHaveBeenCalledTimes(consoleWarnCalls);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('getExtendedVarType with possible values', () => {
  const configWithExtended = { parameterId: { varType: 'varType', extendedVarType: 'extended' } };
  const configWithoutExtended = { parameterId: { varType: 'varType' } };

  test.each`
    parameterId      | configParameters         | expectedRes
    ${null}          | ${null}                  | ${undefined}
    ${null}          | ${undefined}             | ${undefined}
    ${null}          | ${''}                    | ${undefined}
    ${null}          | ${{}}                    | ${undefined}
    ${undefined}     | ${null}                  | ${undefined}
    ${undefined}     | ${undefined}             | ${undefined}
    ${undefined}     | ${''}                    | ${undefined}
    ${undefined}     | ${{}}                    | ${undefined}
    ${''}            | ${null}                  | ${undefined}
    ${''}            | ${undefined}             | ${undefined}
    ${''}            | ${''}                    | ${undefined}
    ${''}            | ${{}}                    | ${undefined}
    ${'parameter'}   | ${null}                  | ${undefined}
    ${'parameter'}   | ${undefined}             | ${undefined}
    ${'parameter'}   | ${''}                    | ${undefined}
    ${'parameter'}   | ${{}}                    | ${undefined}
    ${'parameter'}   | ${{ withoutParam: '' }}  | ${undefined}
    ${'parameterId'} | ${configWithoutExtended} | ${undefined}
    ${'parameterId'} | ${configWithExtended}    | ${'extended'}
  `(
    'if "$parameterId" and "$configParameters" then "$expectedRes"',
    ({ parameterId, configParameters, expectedRes }) => {
      const res = ConfigUtils.getExtendedVarType(parameterId, configParameters);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});
