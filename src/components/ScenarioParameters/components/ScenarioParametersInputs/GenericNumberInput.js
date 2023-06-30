// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
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

export const GenericNumberInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty, error }) => {
  const { t } = useTranslation();
  const inputProps = {
    min: getMinValue(parameterData),
    max: getMaxValue(parameterData),
  };
  const textFieldProps = {
    disabled: !context.editMode,
    id: `number-input-${parameterData.id}`,
  };

  let value = parameterValue;
  if (value == null) {
    value = NaN;
  }

  const changeValue = useCallback(
    (newValue) => {
      setParameterValue(newValue);
    },
    [setParameterValue]
  );

  return (
    <BasicNumberInput
      key={parameterData.id}
      id={parameterData.id}
      label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={value}
      changeNumberField={changeValue}
      textFieldProps={textFieldProps}
      inputProps={inputProps}
      isDirty={isDirty}
      error={error}
    />
  );
};

GenericNumberInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  defaultParameterValue: PropTypes.number,
  isDirty: PropTypes.bool,
  error: PropTypes.object,
};

GenericNumberInput.defaultProps = {
  isDirty: false,
};

GenericNumberInput.useValidationRules = (parameterData) => {
  const { t } = useTranslation();
  return {
    required: t('views.scenario.scenarioParametersValidationErrors.required', 'This field is required'),
    validate: (v) => {
      if (parameterData?.varType === 'int') {
        return (
          Number.isInteger(v) ||
          t('views.scenario.scenarioParametersValidationErrors.integer', 'This value must be an integer')
        );
      }
    },
  };
};
