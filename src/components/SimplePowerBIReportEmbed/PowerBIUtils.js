// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { PowerBIReportEmbedSimpleFilter, PowerBIReportEmbedMultipleFilter } from './PowerBIReportEmbedFilter';

function constructDynamicValue (filterValue, obj) {
  if (filterValue === undefined) {
    throw new Error('value path is undefined');
  }
  const res = filterValue.split('.').reduce(function (o, k) {
    return o && o[k];
  }, obj);
  if (res === undefined) {
    throw new Error(filterValue + ' is not a valid path!!! Please adapt the configuration');
  }
  return res;
}

const constructDynamicFilters = (filtersConfig, obj) => {
  const result = [];
  for (const filterConfig of filtersConfig) {
    const filterValues = filterConfig.values;
    let filter;
    if (Array.isArray(filterValues)) {
      const values = [];
      for (const filterValue of filterValues) {
        const value = constructDynamicValue(filterValue, obj, filterConfig);
        values.push(value);
      }
      filter = new PowerBIReportEmbedMultipleFilter(filterConfig.target.table, filterConfig.target.column, values);
    } else if (typeof filterValues === 'string') {
      const filterValue = filterConfig.values;
      const value = constructDynamicValue(filterValue, obj, filterConfig);
      filter = new PowerBIReportEmbedSimpleFilter(filterConfig.target.table, filterConfig.target.column, [value]);
    }
    result.push(filter);
  }
  return result;
};

export const PowerBIUtils = {
  constructDynamicFilters
};
