// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { ScenarioParameterInputFactory } from './ScenarioParameterInputFactory';

const create = (t, parametersGroupData, parametersState, setParametersState, editMode) => {
  return (
    <div key={parametersGroupData.id}>
      {
        parametersGroupData.parameters.map(parameterData =>
          ScenarioParameterInputFactory.create(t, parameterData, parametersState, setParametersState, editMode))
      }
    </div>
  );
};

export const ScenarioParametersTabFactory = {
  create
};
