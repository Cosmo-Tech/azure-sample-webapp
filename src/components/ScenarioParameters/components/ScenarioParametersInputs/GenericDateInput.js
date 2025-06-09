// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { isAfter } from 'date-fns/isAfter';
import { isBefore } from 'date-fns/isBefore';
import { isValid } from 'date-fns/isValid';
import { DateUtils } from '@cosmotech/core';
import { BasicDateInput } from '@cosmotech/ui';
import { useDateConstraintValidation } from '../../../../hooks/ParameterConstraintsHooks';
import { TranslationUtils } from '../../../../utils';

export const GenericDateInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty, error }) => {
  const { t } = useTranslation();
  const minDate = parameterData.minValue ? new Date(parameterData.minValue) : undefined;
  const maxDate = parameterData.maxValue ? new Date(parameterData.maxValue) : undefined;

  // Example of customized component to behave differently based on the value of another parameter in the dataset
  // creation dialog. Note that in the context of the dataset creation dialog, in React Hook Form data, the parameter
  // ids are prefixed with the id of the datasource run template followed by a dot character (e.g.
  // my_datasource_etl.my_parameter). If the id of the run template contains a dot, it is replaced by "__DOT__" to
  // prevent accidental conflicts with parameter and run template ids
  const watchedValue = useWatch({
    name: '__DOT__////etl_sub_dataset_by_filter.etl_param_subdataset_filter_start_date',
  });
  // Id of the parameter with a custom behavior, without the custom prefix that is used only for RHF data
  if (parameterData.id === 'etl_param_subdataset_filter_end_date') {
    // Example of how to hide the end date component if the start date is after 2026-01-01
    if (watchedValue >= new Date('2026-01-01')) return null;
  }

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
