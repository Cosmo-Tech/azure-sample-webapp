// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DateUtils } from '@cosmotech/core';

const getTableCellDefaultValue = (column, dateFormat) => {
  const params = column?.cellEditorParams;
  switch (column?.type?.find((type) => ['number', 'int', 'bool', 'enum', 'date'].includes(type))) {
    case 'number':
    case 'int':
      return (
        params?.defaultValue ??
        params?.minValue ??
        (parseFloat(params?.maxValue) && parseFloat(params.maxValue) < 0 ? params.maxValue : '0')
      );
    case 'bool':
      return params?.defaultValue ?? 'false';
    case 'enum':
      return params?.defaultValue ?? params?.enumValues?.[0] ?? '';
    case 'date':
      return params?.defaultValue
        ? DateUtils.format(new Date(params.defaultValue), dateFormat)
        : params?.minValue
        ? DateUtils.format(new Date(params.minValue), dateFormat)
        : DateUtils.format(new Date(0), dateFormat);
    default:
      return params?.defaultValue ?? 'value';
  }
};

const createNewTableLine = (columns, dateFormat) => {
  const newLine = {};
  columns.forEach((column) => {
    newLine[column.field] = !column?.cellEditorParams?.acceptsEmptyFields
      ? getTableCellDefaultValue(column, dateFormat)
      : '';
  });
  return newLine;
};

export const TableUtils = {
  createNewTableLine,
};
