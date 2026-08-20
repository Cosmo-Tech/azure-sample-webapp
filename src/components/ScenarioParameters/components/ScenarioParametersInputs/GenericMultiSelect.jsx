// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { MultiSelect } from '@cosmotech/ui';
import { useDynamicValues } from '../../../../hooks/DynamicValuesHooks';
import { ConfigUtils, TranslationUtils } from '../../../../utils';
import { PARAMETER_CONTEXT_WIDTH } from '../../../../utils/scenarioParameters/ParameterContext';

const GRID_ITEM_PROPS_MAPPING = {
  [PARAMETER_CONTEXT_WIDTH.SMALL]: { size: 6, sx: { pt: 1 } },
  [PARAMETER_CONTEXT_WIDTH.LARGE]: { size: 3 },
};

export const GenericMultiSelect = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  isDirty = false,
  error,
}) => {
  const { t } = useTranslation();
  const gridItemProps = GRID_ITEM_PROPS_MAPPING[context?.width ?? PARAMETER_CONTEXT_WIDTH.SMALL];

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
    // Call setParameterValue when dynamic values are enabled to trigger an update of the form validity. This
    // is required to automatically enable a form confirmation button when a default value is selected from
    // dynamic values (e.g. in the dataset creation wizard). Yet, we don't want this behavior in the scenario
    // parameters, because it tends to set the form state to "dirty" for enums without default values.
    if (dynamicEnumValues != null && parameterValue == null && enumValues?.length > 0) {
      setParameterValue([enumValues[0]?.key]);
    }
  }, [enumValues, dynamicEnumValues, parameterValue, setParameterValue]);

  const labels = useMemo(() => {
    return {
      label: t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id),
      noValues: t('genericcomponent.multiSelect.noValues', 'No selected values'),
    };
  }, [t, parameterData.id]);
  const isRequired = ConfigUtils.getParameterAttribute(parameterData, 'required') ?? false;

  if (dynamicValuesError) return dynamicValuesError;
  return (
    <Grid {...gridItemProps}>
      <Grid container direction="row" sx={{ alignItems: 'stretch' }}>
        {loadingDynamicValuesPlaceholder}
        {dynamicEnumValues !== null && (
          <MultiSelect
            id={parameterData.id}
            labels={labels}
            tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
            selectedKeys={Array.isArray(parameterValue) ? parameterValue : []}
            onChange={setParameterValue}
            disabled={!context.editMode}
            options={enumValues}
            isDirty={isDirty}
            error={error}
            required={isRequired}
          />
        )}
      </Grid>
    </Grid>
  );
};

GenericMultiSelect.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  error: PropTypes.object,
};

GenericMultiSelect.useValidationRules = (parameterData, isDatasetManagerView) => {
  const { t } = useTranslation();
  const requiredValueFromConfig = ConfigUtils.getParameterAttribute(parameterData, 'required');
  const isRequired = requiredValueFromConfig === true || (isDatasetManagerView && requiredValueFromConfig !== false);

  return {
    required: {
      value: isRequired,
      message: t('views.scenario.scenarioParametersValidationErrors.required', 'This field is required'),
    },
  };
};
