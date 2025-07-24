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
    defaultValueInteger: '10',
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

  test('should return "0" for int type with no default or min/max values', () => {
    const column = { type: ['int'] };
    expect(TableUtils.getTableCellDefaultValue(column)).toBe('0');
  });

  test('should return defaultValue as string for int type', () => {
    const column = { type: ['int'], defaultValue: 10 };
    expect(TableUtils.getTableCellDefaultValue(column)).toBe('10');
  });

  test('should return "false" for bool type if no default is provided', () => {
    const column = { type: ['bool'] };
    expect(TableUtils.getTableCellDefaultValue(column)).toBe('false');
  });

  test('should return "true" for bool type if defaultValue is true', () => {
    const column = { type: ['bool'], defaultValue: 'true' };
    expect(TableUtils.getTableCellDefaultValue(column)).toBe('true');
  });

  test('should return enum defaultValue', () => {
    const column = { type: ['enum'], defaultValue: 'Yes' };
    expect(TableUtils.getTableCellDefaultValue(column)).toBe('Yes');
  });

  test('should return first enumValue if defaultValue not set', () => {
    const column = { type: ['enum'], enumValues: ['One', 'Two'] };
    expect(TableUtils.getTableCellDefaultValue(column)).toBe('One');
  });

  test('should return formatted date from defaultValue', () => {
    const column = { type: ['date'], defaultValue: '2000-01-01T00:00:00Z' };
    expect(TableUtils.getTableCellDefaultValue(column, 'dd/MM/yyyy')).toBe('01/01/2000');
  });

  test('should return default string if no type matches', () => {
    const column = { defaultValue: 'Some value' };
    expect(TableUtils.getTableCellDefaultValue(column)).toBe('Some value');
  });
});
