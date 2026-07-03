// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { AgGridUtils } from '@cosmotech/core';

export const parseCSVFromAPIResponse = (response, columns, options) => {
  const data = response?.data ?? response;

  let columnDefinition = columns;
  if (columnDefinition == null) {
    const header = data.split('\n')[0];
    const columnsFound = header.split(',');
    columnDefinition = columnsFound.map((col) => ({ acceptsEmptyFields: true, field: col }));
  }

  return AgGridUtils.fromCSV(data, true, columnDefinition, options);
};

export const getColumnFirstValue = (colsAndRows, columnName) => {
  return colsAndRows?.rows?.[0]?.[columnName];
};

export const getConcatenatedColumnValues = (colsAndRows, columnName) => {
  const values = [];
  const rows = colsAndRows?.rows ?? [];
  rows.forEach((row) => {
    if (row?.[columnName] != null) values.push(JSON.stringify(row[columnName]));
  });
  return values.join(', ');
};
