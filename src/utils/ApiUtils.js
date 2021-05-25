// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';

const clone = rfdc();

export function formatScenarioParametersForApi (scenarioParameters) {
  // Reformat scenario parameters to match the API expected types
  return scenarioParameters.map(param => {
    // Clone the original parameter
    const newParam = clone(param);
    // Cast boolean values into string values
    if (newParam.varType === 'bool') {
      newParam.value = newParam.value.toString();
    }
    return newParam;
  });
}

export function formatScenarioParametersFromApi (scenarioParameters) {
  if (!scenarioParameters) {
    return undefined;
  }
  // Reformat scenario parameters to match the front-end expected types
  return scenarioParameters.map(param => {
    // Clone the original parameter
    const newParam = clone(param);
    // Cast string values into boolean values
    if (newParam.varType === 'bool') {
      newParam.value = (newParam.value === 'true');
    }
    return newParam;
  });
}
