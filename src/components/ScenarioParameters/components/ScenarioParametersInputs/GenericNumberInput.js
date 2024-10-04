// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Grid, Stack } from '@mui/material';
import { BasicNumberInput, FadingTooltip } from '@cosmotech/ui';
import { useLoadInitialValueFromDataset } from '../../../../hooks/DynamicValuesHooks';
import { useParameterConstraintValidation } from '../../../../hooks/ParameterConstraintsHooks';
import { TranslationUtils } from '../../../../utils';

export const GenericNumberInput = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  resetParameterValue,
  isDirty = false,
  error,
}) => {
  const { t } = useTranslation();

  const textFieldProps = {
    disabled: !context.editMode,
    id: `number-input-${parameterData.id}`,
  };
  const { dynamicValue, loadingDynamicValuePlaceholder, dynamicValueErrorMessage } = useLoadInitialValueFromDataset(
    parameterValue,
    parameterData,
    context.targetDatasetId
  );

  useEffect(() => {
    if (parameterValue == null && dynamicValue != null && !isDirty) {
      if (parameterData.options?.dynamicValues) {
        resetParameterValue(dynamicValue);
      }
    }
  }, [parameterValue, dynamicValue, isDirty, resetParameterValue, parameterData.options?.dynamicValues]);

  const changeValue = useCallback(
    (newValue) => {
      setParameterValue(newValue);
    },
    [setParameterValue]
  );

  if (loadingDynamicValuePlaceholder) return loadingDynamicValuePlaceholder;

  return (
    <Stack
      direction="row"
      sx={{
        gap: 1,
        alignItems: 'center',
      }}
    >
      <Grid item xs={3}>
        <BasicNumberInput
          key={parameterData.id}
          id={parameterData.id}
          label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
          tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
          value={parameterValue ?? NaN}
          changeNumberField={changeValue}
          textFieldProps={textFieldProps}
          isDirty={isDirty}
          error={error}
        />
      </Grid>
      {dynamicValueErrorMessage && (
        <FadingTooltip title={dynamicValueErrorMessage} placement={'right'}>
          <ErrorOutlineIcon data-cy="dynamic-value-error-icon" size="small" />
        </FadingTooltip>
      )}
    </Stack>
  );
};

GenericNumberInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  resetParameterValue: PropTypes.func,
  defaultParameterValue: PropTypes.number,
  isDirty: PropTypes.bool,
  error: PropTypes.object,
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
