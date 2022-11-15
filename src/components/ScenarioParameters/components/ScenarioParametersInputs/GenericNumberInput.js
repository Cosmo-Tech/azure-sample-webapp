// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicNumberInput } from '@cosmotech/ui';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TranslationUtils } from '../../../../utils';

const DEFAULT_MIN_VALUE = -1e10 + 1;
const DEFAULT_MAX_VALUE = 1e10 - 1;

function getMinValue(parameterData) {
  if (parameterData.minValue === null || parameterData.minValue === undefined) {
    return DEFAULT_MIN_VALUE;
  }
  return parameterData.minValue;
}

function getMaxValue(parameterData) {
  if (parameterData.maxValue === null || parameterData.maxValue === undefined) {
    return DEFAULT_MAX_VALUE;
  }
  return parameterData.maxValue;
}

export const GenericNumberInput = ({ parameterData, parametersState, setParametersState, context }) => {
  const { t } = useTranslation();
  const inputProps = {
    min: getMinValue(parameterData),
    max: getMaxValue(parameterData),
  };
  const textFieldProps = {
    disabled: !context.editMode,
    id: parameterData.id,
  };

  function setValue(newValue) {
    setParametersState((currentParametersState) => ({
      ...currentParametersState,
      [parameterData.id]: newValue,
    }));
  }

  let value = parametersState[parameterData.id];
  if (value == null) {
    value = NaN;
  }

  return (
    <BasicNumberInput
      key={parameterData.id}
      data-cy={`number-input-${parameterData.id}`}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={value}
      changeNumberField={setValue}
      textFieldProps={textFieldProps}
      inputProps={inputProps}
    />
  );
};

GenericNumberInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
