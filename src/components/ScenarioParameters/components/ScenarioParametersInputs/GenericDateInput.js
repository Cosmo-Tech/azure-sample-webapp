// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicDateInput } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { TranslationUtils } from '../../../../utils';

export const GenericDateInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty }) => {
  const { t } = useTranslation();
  const minDate = parameterData.minValue ? new Date(parameterData.minValue) : undefined;
  const maxDate = parameterData.maxValue ? new Date(parameterData.maxValue) : undefined;
  const dateProps = {
    disabled: !context.editMode,
    id: `date-input-${parameterData.id}`,
    minDate,
    maxDate,
    minDateMessage: t('genericcomponent.dateInput.error.minDateMessage', 'Minimum date is not respected'),
    maxDateMessage: t('genericcomponent.dateInput.error.maxDateMessage', 'Maximum date is not respected'),
    invalidDateMessage: t('genericcomponent.dateInput.error.invalidDateMessage', 'Date is invalid'),
  };

  return (
    <BasicDateInput
      key={parameterData.id}
      id={parameterData.id}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={parameterValue}
      changeSelectedDate={setParameterValue}
      dateProps={dateProps}
      isDirty={isDirty}
    />
  );
};

GenericDateInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
};
GenericDateInput.defaultProps = {
  isDirty: false,
};
