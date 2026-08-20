// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { BasicToggleInput } from '@cosmotech/ui';
import { useParameterConstraintValidation } from '../../../../hooks/ParameterConstraintsHooks';
import { ConfigUtils, TranslationUtils } from '../../../../utils';
import { PARAMETER_CONTEXT_WIDTH } from '../../../../utils/scenarioParameters/ParameterContext';

const GRID_ITEM_PROPS_MAPPING = {
  [PARAMETER_CONTEXT_WIDTH.SMALL]: { size: 12, sx: { pt: 1 } },
  [PARAMETER_CONTEXT_WIDTH.LARGE]: { size: 3 },
};

export const GenericToggleInput = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  isDirty = false,
  error,
}) => {
  const { t } = useTranslation();
  const gridItemProps = GRID_ITEM_PROPS_MAPPING[context?.width ?? PARAMETER_CONTEXT_WIDTH.SMALL];
  const switchFieldProps = { disabled: !context.editMode, id: `toggle-input-${parameterData.id}` };

  return (
    <Grid {...gridItemProps}>
      <BasicToggleInput
        key={parameterData.id}
        id={parameterData.id}
        label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        value={parameterValue ?? false}
        changeSwitchType={setParameterValue}
        switchProps={switchFieldProps}
        isDirty={isDirty}
        error={error}
      />
    </Grid>
  );
};

GenericToggleInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  error: PropTypes.object,
};

GenericToggleInput.useValidationRules = (parameterData) => {
  const { t } = useTranslation();
  const { getParameterConstraintValidation } = useParameterConstraintValidation(parameterData);
  const isRequired = ConfigUtils.getParameterAttribute(parameterData, 'required');

  return {
    required: {
      value: isRequired,
      message: t('views.scenario.scenarioParametersValidationErrors.required', 'This field is required'),
    },
    validate: {
      constraint: (v) => getParameterConstraintValidation(v),
    },
  };
};
