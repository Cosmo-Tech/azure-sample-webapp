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

export const GenericNumberInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty }) => {
  const { t } = useTranslation();
  const inputProps = {
    min: getMinValue(parameterData),
    max: getMaxValue(parameterData),
  };
  const textFieldProps = {
    disabled: context.isReadOnly,
    id: `number-input-${parameterData.id}`,
  };

  let value = parameterValue;
  if (value == null) {
    value = NaN;
  }

  return (
    <BasicNumberInput
      key={parameterData.id}
      id={parameterData.id}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={value}
      changeNumberField={setParameterValue}
      textFieldProps={textFieldProps}
      inputProps={inputProps}
      isDirty={isDirty}
    />
  );
};

GenericNumberInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
};
GenericNumberInput.defaultProps = {
  isDirty: false,
};
