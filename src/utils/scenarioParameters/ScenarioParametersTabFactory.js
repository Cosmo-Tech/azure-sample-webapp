// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { ScenarioParameterInputFactory } from './ScenarioParameterInputFactory';

const create = (t, datasets, parametersGroupData, parametersState, setParametersState, editMode) => {
  return (
    <div key={parametersGroupData.id}>
      {
        parametersGroupData.parameters.map(parameterData => ScenarioParameterInputFactory.create(
          t, datasets, parameterData, parametersState, setParametersState, editMode))
      }
    </div>
  );
};

export const ScenarioParametersTabFactory = {
  create
};
