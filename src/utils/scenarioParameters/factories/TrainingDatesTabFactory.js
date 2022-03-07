// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { ScenarioParameterInputFactory } from './ScenarioParameterInputFactory';

const groupContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'baseline',
};

const invalidDatesMessageStyle = {
  color: '#FF667F',
};

const invalidDatesMessage = (
  <div style={invalidDatesMessageStyle}>Invalid input: start date must be earlier than end date</div>
);

const create = (t, datasets, parametersGroupData, parametersState, setParametersState, editMode) => {
  return (
    <div key={parametersGroupData.id} style={groupContainerStyle}>
      {parametersGroupData.parameters.map((parameterData) =>
        ScenarioParameterInputFactory.create(t, datasets, parameterData, parametersState, setParametersState, editMode)
      )}
      {parametersState.training_start_date > parametersState.training_end_date ? invalidDatesMessage : null}
    </div>
  );
};

export const TrainingDatesTabFactory = {
  create,
};
