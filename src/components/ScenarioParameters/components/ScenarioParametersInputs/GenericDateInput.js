// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isValid from 'date-fns/isValid';
import { DateUtils } from '@cosmotech/core';
import { BasicDateInput } from '@cosmotech/ui';
import { useDateConstraintValidation } from '../../../../hooks/ParameterConstraintsHooks';
import { TranslationUtils } from '../../../../utils';

export const GenericDateInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty, error }) => {
  const { t } = useTranslation();
  const minDate = parameterData.minValue ? new Date(parameterData.minValue) : undefined;
  const maxDate = parameterData.maxValue ? new Date(parameterData.maxValue) : undefined;
  const dateProps = {
    disabled: !context.editMode,
    id: `date-input-${parameterData.id}`,
    minDate,
    maxDate,
  };
  return (
    <Grid item id={`date-input-${parameterData.id}`} xs={3}>
      <BasicDateInput
        key={parameterData.id}
        id={parameterData.id}
        label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        value={parameterValue}
        changeSelectedDate={setParameterValue}
        dateProps={dateProps}
        isDirty={isDirty}
        error={error}
        reverseTimezoneOffset={true}
      />
    </Grid>
  );
};

GenericDateInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  error: PropTypes.object,
};
GenericDateInput.defaultProps = {
  isDirty: false,
};
GenericDateInput.useValidationRules = (parameterData) => {
  const { t } = useTranslation();
  const minDate = parameterData.minValue ? new Date(parameterData.minValue) : undefined;
  const maxDate = parameterData.maxValue ? new Date(parameterData.maxValue) : undefined;
  const { getDateConstraintValidation } = useDateConstraintValidation(parameterData);

  return {
    required: t('views.scenario.scenarioParametersValidationErrors.required', 'This field is required'),
    validate: {
      isValid: (v) =>
        isValid(v) ||
        t(
          'views.scenario.scenarioParametersValidationErrors.notValid',
          'The format is not valid, expected: MM/dd/YYYY'
        ),
      minDate: (v) =>
        !isBefore(new Date(v), minDate) ||
        TranslationUtils.getStringWithUnescapedCharacters(
          t('views.scenario.scenarioParametersValidationErrors.minDate', 'Minimum date is {{minDate}}', {
            minDate: DateUtils.formatUTCDateAsLocal(minDate, 'MM/dd/yyyy'),
            interpolation: {
              escape: TranslationUtils.getStringWithEscapedCharacters,
            },
          })
        ),
      maxDate: (v) =>
        !isAfter(new Date(v), maxDate) ||
        TranslationUtils.getStringWithUnescapedCharacters(
          t('views.scenario.scenarioParametersValidationErrors.maxDate', 'Maximum date is {{maxDate}}', {
            maxDate: DateUtils.formatUTCDateAsLocal(maxDate, 'MM/dd/yyyy'),
            interpolation: { escape: TranslationUtils.getStringWithEscapedCharacters },
          })
        ),
      constraint: (v) => getDateConstraintValidation(v),
    },
  };
};
