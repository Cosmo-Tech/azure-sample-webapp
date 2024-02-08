// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { BasicNumberInput } from '@cosmotech/ui';
import { useParameterConstraintValidation } from '../../../../hooks/ParameterConstraintsHooks';
import { TranslationUtils } from '../../../../utils';

export const GenericNumberInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty, error }) => {
  const { t } = useTranslation();

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
    <Grid item xs={3}>
      <BasicNumberInput
        key={parameterData.id}
        id={parameterData.id}
        label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        value={value}
        changeNumberField={changeValue}
        textFieldProps={textFieldProps}
        isDirty={isDirty}
        error={error}
      />
    </Grid>
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
  const { getParameterConstraintValidation } = useParameterConstraintValidation(parameterData);
  const DEFAULT_MIN_VALUE = -1e10 + 1;
  const DEFAULT_MAX_VALUE = 1e10 - 1;
  const min = parameterData?.minValue ?? DEFAULT_MIN_VALUE;
  const max = parameterData?.maxValue ?? DEFAULT_MAX_VALUE;
  return {
    required: t('views.scenario.scenarioParametersValidationErrors.required', 'This field is required'),
    min: {
      value: min,
      message: t(
        'views.scenario.scenarioParametersValidationErrors.minValue',
        'Minimum value for this field is {{minValue}}',
        { minValue: min }
      ),
    },
    max: {
      value: max,
      message: t(
        'views.scenario.scenarioParametersValidationErrors.maxValue',
        'Maximum value for this field is {{maxValue}}',
        { maxValue: max }
      ),
    },
    validate: {
      integer: (v) => {
        if (parameterData?.varType === 'int') {
          return (
            Number.isInteger(v) ||
            t('views.scenario.scenarioParametersValidationErrors.integer', 'This value must be an integer')
          );
        }
      },
      constraint: (v) => getParameterConstraintValidation(v),
    },
  };
};
