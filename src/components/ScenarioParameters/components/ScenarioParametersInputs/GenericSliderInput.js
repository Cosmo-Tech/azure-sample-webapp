// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicSliderInput } from '@cosmotech/ui';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TranslationUtils } from '../../../../utils';

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 100;
function getMinValue(parameterData) {
  if (parameterData.minValue == null) {
    return DEFAULT_MIN_VALUE;
  }
  return parameterData.minValue;
}

function getMaxValue(parameterData) {
  if (parameterData.maxValue == null) {
    return DEFAULT_MAX_VALUE;
  }
  return parameterData.maxValue;
}

export const GenericSliderInput = ({ parameterData, parametersState, setParametersState, context }) => {
  const min = getMinValue(parameterData);
  const max = getMaxValue(parameterData);
  const { t } = useTranslation();
  const setValue = (newValue) => {
    setParametersState((currentParametersState) => ({
      ...currentParametersState,
      [parameterData.id]: newValue,
    }));
  };

  let value = parametersState[parameterData.id];
  if (value == null) {
    value = NaN;
  }
  return (
    <BasicSliderInput
      key={parameterData.id}
      data-cy={parameterData.dataCy}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={value}
      handleSliderValueChange={setValue}
      disabled={!context.editMode}
      min={min}
      max={max}
    />
  );
};
GenericSliderInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
