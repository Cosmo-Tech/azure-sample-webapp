// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicDateInput } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export const GenericDateInput = ({ parameterData, parametersState, setParametersState, context }) => {
  const { t } = useTranslation();
  const minDate = parameterData.minValue ? new Date(parameterData.minValue) : undefined;
  const maxDate = parameterData.maxValue ? new Date(parameterData.maxValue) : undefined;
  const dateProps = {
    disabled: !context.editMode,
    id: parameterData.id,
    minDate: minDate,
    maxDate: maxDate,
    minDateMessage: t('genericcomponent.dateInput.error.minDateMessage', 'Minimum date is not respected'),
    maxDateMessage: t('genericcomponent.dateInput.error.maxDateMessage', 'Maximum date is not respected'),
    invalidDateMessage: t('genericcomponent.dateInput.error.invalidDateMessage', 'Date is invalid'),
  };

  function setValue(newValue) {
    setParametersState((currentParametersState) => ({
      ...currentParametersState,
      [parameterData.id]: newValue,
    }));
  }

  return (
    <BasicDateInput
      key={parameterData.id}
      id={parameterData.id}
      data-cy={parameterData.dataCy} // Optional data for cypress
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      value={parametersState[parameterData.id] || new Date()}
      changeSelectedDate={setValue}
      dateProps={dateProps}
    />
  );
};
GenericDateInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
