// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import ScenarioParametersTab from './ScenarioParametersTab';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ScenarioParametersTabs } from '../index';
// eslint-disable-next-line max-len
import { CUSTOM_PARAMETERS_GROUPS_COMPONENTS_MAPPING } from '../../../../utils/scenarioParameters/custom/ParametersGroupsComponentsMapping';

const ScenarioParametersTabsWrapper = ({
  parametersGroupsMetadata,
  parametersValuesToRender,
  setParametersValuesToRender,
  userRole,
  context,
}) => {
  const { t } = useTranslation();
  const datasets = useSelector((state) => state.dataset?.list?.data);
  for (const parametersGroupMetadata of parametersGroupsMetadata) {
    const tabFactory = CUSTOM_PARAMETERS_GROUPS_COMPONENTS_MAPPING[parametersGroupMetadata.id] || ScenarioParametersTab;
    // 'name' property helps distinguish React components from factories; we also need to check in WrappedComponent
    // for components connected to redux
    if ('name' in tabFactory || 'name' in tabFactory?.WrappedComponent) {
      parametersGroupMetadata.tab = React.createElement(tabFactory, {
        parametersGroupData: parametersGroupMetadata,
        parametersState: parametersValuesToRender,
        setParametersState: setParametersValuesToRender,
        context: context,
      });
    }
    // Note that the factories are now deprecated and
    // won't be supported in the next major version of the webapp
    else {
      parametersGroupMetadata.tab = tabFactory.create(
        t,
        datasets,
        parametersGroupMetadata,
        parametersValuesToRender,
        setParametersValuesToRender,
        context
      );
      console.warn(
        "Warning: Factories are now deprecated and won't be supported in the next major version of the webapp"
      );
    }
  }
  return <ScenarioParametersTabs userRole={userRole} parametersGroupsMetadata={parametersGroupsMetadata} />;
};
ScenarioParametersTabsWrapper.propTypes = {
  parametersGroupsMetadata: PropTypes.array.isRequired,
  userRole: PropTypes.string.isRequired,
  parametersValuesToRender: PropTypes.object.isRequired,
  setParametersValuesToRender: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
export default ScenarioParametersTabsWrapper;
