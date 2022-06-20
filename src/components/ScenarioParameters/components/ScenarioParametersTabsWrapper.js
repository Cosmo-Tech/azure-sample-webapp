// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { ScenarioParametersTabs } from './index';
import PropTypes from 'prop-types';
import { ScenarioParametersTabFactory } from '../../../utils/scenarioParameters/factories/ScenarioParametersTabFactory';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CUSTOM_PARAMETERS_GROUPS_FACTORIES_MAPPING } from '../../../utils/scenarioParameters/custom/FactoriesMapping';
// eslint-disable-next-line max-len
import { CustomScenarioParametersTabFactory } from '../../../utils/scenarioParameters/factories/CustomScenarioParametersTabFactory';

const ScenarioParametersTabsWrapper = ({
  parametersGroupsMetadata,
  parametersValuesToRender,
  setParametersValuesToRender,
  editMode,
  userRoles,
  context,
}) => {
  const { t } = useTranslation();
  const datasets = useSelector((state) => state.dataset?.list?.data);
  for (const parametersGroupMetadata of parametersGroupsMetadata) {
    // check if parametersGroup belongs to CustomFactory
    if (parametersGroupMetadata.id in CUSTOM_PARAMETERS_GROUPS_FACTORIES_MAPPING) {
      // implement your custom logic for chosen parameters group
      parametersGroupMetadata.tab = CustomScenarioParametersTabFactory.create();
    } else {
      // Generate input components for each scenario parameters tab
      parametersGroupMetadata.tab = ScenarioParametersTabFactory.create(
        t,
        datasets,
        parametersGroupMetadata,
        parametersValuesToRender,
        setParametersValuesToRender,
        editMode
      );
    }
  }
  return <ScenarioParametersTabs userRoles={userRoles} parametersGroupsMetadata={parametersGroupsMetadata} />;
};
ScenarioParametersTabsWrapper.propTypes = {
  parametersGroupsMetadata: PropTypes.array.isRequired,
  userRoles: PropTypes.array.isRequired,
  parametersValuesToRender: PropTypes.object.isRequired,
  setParametersValuesToRender: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  context: PropTypes.object,
};
ScenarioParametersTabsWrapper.defaultProps = {
  context: {},
};
export default ScenarioParametersTabsWrapper;
