// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DateUtils } from '@cosmotech/core';

const getTableCellDefaultValue = (column, dateFormat) => {
  switch (column?.type?.find((type) => ['number', 'int', 'bool', 'enum', 'date'].includes(type))) {
    case 'number':
    case 'int':
      return (
        column?.defaultValue ??
        column?.minValue ??
        (parseFloat(column?.maxValue) && parseFloat(column.maxValue) < 0 ? column.maxValue : '0')
      );
    case 'bool':
      return column?.defaultValue ?? 'false';
    case 'enum':
      return column?.defaultValue ?? column?.enumValues?.[0] ?? '';
    case 'date':
      return column?.defaultValue
        ? DateUtils.format(new Date(column.defaultValue), dateFormat)
        : column?.minValue
          ? DateUtils.format(new Date(column.minValue), dateFormat)
          : DateUtils.format(new Date(0), dateFormat);
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
};
