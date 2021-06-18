// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';

const clone = rfdc();

export const SCENARIO_RUN_STATE = {
  CREATED: 'Created',
  RUNNING: 'Running',
  SUCCESSFUL: 'Successful',
  FAILED: 'Failed'
};

export function formatParametersForApi (parameters) {
  // Reformat scenario parameters to match the API expected types
  const newParams = parameters.map(param => {
    // Clone the original parameter
    const newParam = clone(param);
    // Cast to string when necessary
    if (newParam.varType === 'bool') {
      newParam.value = newParam.value.toString();
    } else if (newParam.varType === 'number') {
      newParam.value = newParam.value.toString();
    } else if (newParam.varType === 'int') {
      newParam.value = newParam.value.toString();
    } else if (newParam.varType === 'date') {
      newParam.value = newParam.value.toISOString();
    }
    return newParam;
  });
  return { parametersValues: newParams };
}

export function formatParametersFromApi (parameters) {
  if (!parameters) {
    return undefined;
  }
  // Reformat scenario parameters to match the front-end expected types
  return parameters.map(param => {
    // Clone the original parameter
    const newParam = clone(param);
    // Cast string values when necessary
    if (newParam.varType === 'bool') {
      newParam.value = (newParam.value === 'true');
    } else if (newParam.varType === 'number') {
      newParam.value = parseFloat(newParam.value);
    } else if (newParam.varType === 'int') {
      newParam.value = parseInt(newParam.value);
    } else if (newParam.varType === 'date') {
      newParam.value = new Date(newParam.value);
    }
    return newParam;
  });
}
