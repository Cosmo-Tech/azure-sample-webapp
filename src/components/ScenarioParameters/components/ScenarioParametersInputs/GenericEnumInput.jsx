// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { BasicEnumInput } from '@cosmotech/ui';
import { useDynamicValues } from '../../../../hooks/DynamicValuesHooks';
import { ConfigUtils, TranslationUtils } from '../../../../utils';
import { PARAMETER_CONTEXT_WIDTH } from '../../../../utils/scenarioParameters/ParameterContext';

const GRID_ITEM_PROPS_MAPPING = {
  [PARAMETER_CONTEXT_WIDTH.SMALL]: { size: 6, sx: { pt: 1 } },
  [PARAMETER_CONTEXT_WIDTH.LARGE]: { size: 3 },
};

export const GenericEnumInput = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  resetParameterValue, // Set a new value without triggering the form 'dirty' state
  isDirty = false,
}) => {
  const { t } = useTranslation();
  const gridItemProps = GRID_ITEM_PROPS_MAPPING[context?.width ?? PARAMETER_CONTEXT_WIDTH.SMALL];

  const textFieldProps = {
    disabled: !context.editMode,
    id: `enum-input-${parameterData.id}`,
  };

  const {
    dynamicValues: dynamicEnumValues,
    dynamicValuesError,
    loadingDynamicValuesPlaceholder,
  } = useDynamicValues(parameterData, context.targetDataset);

  const enumValues = useMemo(() => {
    if (Array.isArray(dynamicEnumValues)) return dynamicEnumValues;

    const rawEnumValues = ConfigUtils.getParameterAttribute(parameterData, 'enumValues') ?? [];
    if (rawEnumValues.length === 0 && ConfigUtils.getParameterAttribute(parameterData, 'dynamicEnumValues') == null) {
      console.warn(
        `Enum values are not defined for scenario parameter "${parameterData.id}".\n` +
          'Please either provide an array in the "additionalData.enumValues" field, or use ' +
          '"additionalData.dynamicEnumValues" for this parameter in the parameters configuration file.'
      );
    }

    for (const enumValue of rawEnumValues) {
      const valueTranslationKey = TranslationUtils.getParameterEnumValueTranslationKey(parameterData.id, enumValue.key);
      const tooltipTranslationKey = TranslationUtils.getParameterEnumValueTooltipTranslationKey(
        parameterData.id,
        enumValue.key
      );
      enumValue.value = t(valueTranslationKey, enumValue.value);
      enumValue.tooltip = t(tooltipTranslationKey, '');
      delete enumValue.tooltipText;
    }
    return rawEnumValues;
  }, [t, parameterData, dynamicEnumValues]);

  useEffect(() => {
    // Call resetParameterValue when dynamic values are enabled to trigger an update of the form validity. This
    // is required to automatically enable a form confirmation button when a default value is selected from
    // dynamic values (e.g. in the dataset creation wizard). Yet, we don't want this behavior in the scenario
    // parameters, because it tends to set the form state to "dirty" for enums without default values.
    if (dynamicEnumValues != null && parameterValue == null && enumValues?.length > 0) {
      resetParameterValue(enumValues[0]?.key);
    }
  }, [enumValues, dynamicEnumValues, parameterValue, resetParameterValue]);

  if (dynamicValuesError) return dynamicValuesError;

  return (
    <Grid {...gridItemProps}>
      {loadingDynamicValuesPlaceholder}
      {dynamicEnumValues !== null && (
        <BasicEnumInput
          key={parameterData.id}
          id={parameterData.id}
          label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
          tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
          value={parameterValue ?? enumValues?.[0]?.key ?? ''}
          changeEnumField={setParameterValue}
          textFieldProps={textFieldProps}
          enumValues={enumValues}
          isDirty={isDirty}
        />
      )}
    </Grid>
  );
};

GenericEnumInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  resetParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
};
