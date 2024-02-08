// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { TableUtils } from '../TableUtils';

describe('Check createNewTableLine returns value', () => {
  const COLUMNS = [
    // Basic webapp handler
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
      enumValues: ['First', 'Second', 'Third'],
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
      defaultValue: 'defaultValue',
    },
    {
      field: 'defaultValueInteger',
      type: ['int'],
      defaultValue: 10,
    },
    {
      field: 'defaultValueBoolean',
      type: ['bool'],
      defaultValue: true,
    },
    {
      field: 'defaultValueEnum',
      type: ['enum'],
      defaultValue: 'Third',
    },
    {
      field: 'defaultValueDate',
      type: ['date'],
      defaultValue: '01/01/2000',
    },
    {
      field: 'defaultValueNumber',
      type: ['number'],
      defaultValue: '3.14',
    },
    // Use of min values
    {
      field: 'minValueInteger',
      type: ['int'],
      minValue: '42',
    },
    {
      field: 'minValueDate',
      type: ['date'],
      minValue: '01/01/2030',
    },
    {
      field: 'minValueNumber',
      type: ['number'],
      minValue: '3.14',
    },
    // Webapp use maxValue because webapp's values are higher
    {
      field: 'maxValueNegativeInteger',
      type: ['int'],
      maxValue: '-42',
    },
    {
      field: 'maxValueNegativeNumber',
      type: ['number'],
      maxValue: '-3.14',
    },
    // Webapp does not use maxValue because webapp's values are lower
    {
      field: 'maxValuePositiveInteger',
      type: ['int'],
      maxValue: '42',
    },
    {
      field: 'maxValuePositiveNumber',
      type: ['number'],
      maxValue: '3.14',
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
    maxValueNegativeInteger: '-42',
    maxValueNegativeNumber: '-3.14',
    maxValuePositiveInteger: '0',
    maxValuePositiveNumber: '0',
  };

  test('if COLUMNS is given, RESULT should be return', () => {
    const result = TableUtils.createNewTableLine(COLUMNS, 'dd/MM/yyyy');
    expect(result).toStrictEqual(RESULT);
  });
});
