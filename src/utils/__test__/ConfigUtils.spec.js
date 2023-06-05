// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { ConfigUtils } from '../ConfigUtils';

describe('buildExtendedVarType with possible values', () => {
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
    const res = ConfigUtils.buildExtendedVarType(varType, extension);
    expect(res).toStrictEqual(expectedRes);
  });
});

describe('getConversionMethod with possible values', () => {
  let spyConsoleWarn;

  beforeAll(() => {
    spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    spyConsoleWarn.mockClear();
  });

  function mockMethod(param) {
    return param;
  }

  function mockMethod2(param) {
    return param;
  }

  const arrayWithoutTypes = { noConversionMethod: true };
  const arrayWithVarType = { varType: mockMethod };
  const arrayWithExtendedVarType = { 'varType-extended': mockMethod2 };
  const arrayWithVarTypeAndWrongExtended = { varType: mockMethod, extended: mockMethod2 };
  const arrayWithBoth = { varType: mockMethod, 'varType-extended': mockMethod2 };

  test.each`
    param                      | subType       | functionArray                       | consoleWarnCalls | expectedRes
    ${null}                    | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${undefined}               | ${undefined}  | ${undefined}                        | ${1}             | ${undefined}
    ${{}}                      | ${undefined}  | ${undefined}                        | ${1}             | ${undefined}
    ${{}}                      | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${{}}                      | ${''}         | ${null}                             | ${1}             | ${undefined}
    ${{}}                      | ${'extended'} | ${null}                             | ${1}             | ${undefined}
    ${{ noVarType: true }}     | ${undefined}  | ${null}                             | ${1}             | ${undefined}
    ${{ noVarType: true }}     | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${null}                             | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${null}                             | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${undefined}                        | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${undefined}                        | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${[]}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${[]}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${{}}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${{}}                               | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${undefined}  | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType2' }} | ${null}       | ${arrayWithVarType}                 | ${1}             | ${undefined}
    ${{ varType: 'varType2' }} | ${undefined}  | ${arrayWithVarType}                 | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${''}         | ${arrayWithoutTypes}                | ${1}             | ${undefined}
    ${{ varType: 'varType' }}  | ${null}       | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${undefined}  | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${''}         | ${arrayWithVarType}                 | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithExtendedVarType}         | ${0}             | ${mockMethod2}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithVarTypeAndWrongExtended} | ${0}             | ${mockMethod}
    ${{ varType: 'varType' }}  | ${'extended'} | ${arrayWithBoth}                    | ${0}             | ${mockMethod2}
  `(
    'if param "$param",subType "subType", functionArray "$functionArray"  ' +
      'and consoleWarnCalls "$consoleWarnCalls" then expectedRes "$expectedRes"',
    ({ param, subType, functionArray, consoleWarnCalls, expectedRes }) => {
      const paramWithSubType = { ...param, options: { subType } };
      const res = ConfigUtils.getConversionMethod(paramWithSubType, functionArray);
      expect(spyConsoleWarn).toHaveBeenCalledTimes(consoleWarnCalls);
      expect(res).toStrictEqual(expectedRes);
    }
  );
});

describe('Check createNewTableLine returns value', () => {
  const COLUMNS = [
    // Basic webapp handler DONE
    {
      field: 'string',
    },
    {
      field: 'integer',
      type: ['int'],
    },
    {
      field: 'boolean',
      type: ['bool'],
    },
    {
      field: 'enum',
      type: ['enum'],
    },
    {
      field: 'enumWithValues',
      type: ['enum'],
      cellEditorParams: { enumValues: ['First', 'Second', 'Third'] },
    },
    {
      field: 'date',
      type: ['date'],
    },
    {
      field: 'number',
      type: ['number'],
    },
    // Set DefaultValues
    {
      field: 'defaultValueString',
      cellEditorParams: { defaultValue: 'defaultValue' },
    },
    {
      field: 'defaultValueInteger',
      type: ['int'],
      cellEditorParams: { defaultValue: 10 },
    },
    {
      field: 'defaultValueBoolean',
      type: ['bool'],
      cellEditorParams: { defaultValue: true },
    },
    {
      field: 'defaultValueEnum',
      type: ['enum'],
      cellEditorParams: { defaultValue: 'Third' },
    },
    {
      field: 'defaultValueDate',
      type: ['date'],
      cellEditorParams: { defaultValue: '01/01/2000' },
    },
    {
      field: 'defaultValueNumber',
      type: ['number'],
      cellEditorParams: { defaultValue: '3.14' },
    },
    // Use of min values
    {
      field: 'minValueInteger',
      type: ['int'],
      cellEditorParams: { minValue: '42' },
    },
    {
      field: 'minValueDate',
      type: ['date'],
      cellEditorParams: { minValue: '01/01/2030' },
    },
    {
      field: 'minValueNumber',
      type: ['number'],
      cellEditorParams: { minValue: '3.14' },
    },
    // Webapp use maxValues because webapps values is higher
    {
      field: 'maxValueInteger',
      type: ['int'],
      cellEditorParams: { maxValue: '-42' },
    },
    {
      field: 'maxValueNumber',
      type: ['number'],
      cellEditorParams: { maxValue: '-3.14' },
    },
  ];
  const RESULT = {
    string: 'value',
    integer: '0',
    boolean: 'false',
    enum: '',
    enumWithValues: 'First',
    date: '01/01/1970',
    number: '0',
    defaultValueString: 'defaultValue',
    defaultValueInteger: 10,
    defaultValueBoolean: true,
    defaultValueEnum: 'Third',
    defaultValueDate: '01/01/2000',
    defaultValueNumber: '3.14',
    minValueInteger: '42',
    minValueDate: '01/01/2030',
    minValueNumber: '3.14',
    maxValueInteger: '-42',
    maxValueNumber: '-3.14',
  };

  test('if COLUMNS is given, RESULT should be return', () => {
    const result = ConfigUtils.createNewTableLine(COLUMNS, 'dd/MM/yyyy');
    expect(result).toStrictEqual(RESULT);
  });
});
