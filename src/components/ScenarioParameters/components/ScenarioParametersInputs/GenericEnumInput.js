// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicEnumInput } from '@cosmotech/ui';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ConfigUtils, TranslationUtils } from '../../../../utils';

export const GenericEnumInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty }) => {
  const { t } = useTranslation();
  const textFieldProps = {
    disabled: !context.editMode,
    id: `enum-input-${parameterData.id}`,
  };

  const enumValues = ConfigUtils.getParameterAttribute(parameterData, 'enumValues');
  if (!enumValues) {
    console.warn(
      `Enum values are not defined for scenario parameter "${parameterData.id}".\n` +
        'Please provide an array in the "options.enumValues" field for this parameter in the parameters ' +
        'configuration file.'
    );
  }
  return (
    <BasicEnumInput
      key={parameterData.id}
      id={parameterData.id}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={parameterValue}
      changeEnumField={setParameterValue}
      textFieldProps={textFieldProps}
      enumValues={enumValues}
      isDirty={isDirty}
    />
  );
};

GenericEnumInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
};
GenericEnumInput.defaultProps = {
  isDirty: false,
};
