// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import * as CSV from 'csv-string';

const constructRowData = (csvData, headers) => {
  const formattedData = [];
  for (let indexCSV = 1; indexCSV < csvData.length; indexCSV++) {
    const row = {};
    for (let index = 0; index < headers.length; index++) {
      row[headers[index]] = csvData[indexCSV][index];
    }
    formattedData.push(row);
  }
  return formattedData;
};

const constructHeaderData = (headers) => {
  const formattedHeaders = [];
  headers.forEach((rawHeader) => {
    const header = {};
    header.headerName = rawHeader;
    header.field = rawHeader;
    header.headerClass = 'resizable-header';
    header.resizable = true;
    formattedHeaders.push(header);
  });
  return formattedHeaders;
};

const constructPreviewData = (stringData) => {
  let rowData = [];
  let headerData = [];
  if (stringData) {
    const csvData = CSV.parse(stringData);
    const headers = csvData[0];
    headerData = constructHeaderData(headers);
    rowData = constructRowData(csvData, headers);
  }
  return { header: headerData, rowData: rowData };
};

export const AgGridUtils = {
  constructPreviewData
};
