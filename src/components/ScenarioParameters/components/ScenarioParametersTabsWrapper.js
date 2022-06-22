// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { ScenarioParametersTabs } from './index';
import PropTypes from 'prop-types';
import { ScenarioParametersTabFactory } from '../../../utils/scenarioParameters/factories/ScenarioParametersTabFactory';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CUSTOM_PARAMETERS_GROUPS_FACTORIES_MAPPING } from '../../../utils/scenarioParameters/custom/FactoriesMapping';

const ScenarioParametersTabsWrapper = ({
  parametersGroupsMetadata,
  parametersValuesToRender,
  setParametersValuesToRender,
  userRoles,
  context,
}) => {
  const { t } = useTranslation();
  const datasets = useSelector((state) => state.dataset?.list?.data);
  for (const parametersGroupMetadata of parametersGroupsMetadata) {
    const tabFactory =
      CUSTOM_PARAMETERS_GROUPS_FACTORIES_MAPPING[parametersGroupMetadata.id] || ScenarioParametersTabFactory;
    parametersGroupMetadata.tab = tabFactory.create(
      t,
      datasets,
      parametersGroupMetadata,
      parametersValuesToRender,
      setParametersValuesToRender,
      context
    );
  }
  return <ScenarioParametersTabs userRoles={userRoles} parametersGroupsMetadata={parametersGroupsMetadata} />;
};
ScenarioParametersTabsWrapper.propTypes = {
  parametersGroupsMetadata: PropTypes.array.isRequired,
  userRoles: PropTypes.array.isRequired,
  parametersValuesToRender: PropTypes.object.isRequired,
  setParametersValuesToRender: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
export default ScenarioParametersTabsWrapper;
