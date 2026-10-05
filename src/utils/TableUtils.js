// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DateUtils } from '@cosmotech/core';

const getTableCellDefaultValue = (column, dateFormat) => {
  switch (column?.type?.find((type) => ['number', 'int', 'bool', 'enum', 'date'].includes(type))) {
    case 'number':
    case 'int':
      return String(
        column?.defaultValue ??
          column?.minValue ??
          (Number.parseFloat(column?.maxValue) && Number.parseFloat(column.maxValue) < 0 ? column.maxValue : 0)
      );
    case 'bool':
      return column?.defaultValue ?? 'false';
    case 'enum':
      return column?.defaultValue ?? column?.enumValues?.[0] ?? '';
    case 'date': {
      const valueToFormat = column?.defaultValue ?? column?.minValue ?? 0;
      return DateUtils.format(new Date(valueToFormat), dateFormat);
    }
    default:
      return column?.defaultValue ?? 'value';
  }
};

const createNewTableLine = (columns, dateFormat) => {
  const newLine = {};

  const browseColumns = (columns) => {
    columns.forEach((column) => {
      if (Array.isArray(column.children) && column.children.length > 0) browseColumns(column.children);
      else newLine[column.field] = column?.acceptsEmptyFields ? '' : getTableCellDefaultValue(column, dateFormat);
    });
  };

  browseColumns(columns);
  return newLine;
};

export const TableUtils = {
  createNewTableLine,
  getTableCellDefaultValue,
};
