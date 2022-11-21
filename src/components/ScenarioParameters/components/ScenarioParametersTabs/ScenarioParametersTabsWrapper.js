// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import ScenarioParametersTab from './ScenarioParametersTab';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ScenarioParametersTabs } from '../index';
import { ConfigUtils } from '../../../../utils';
// eslint-disable-next-line max-len
import { CUSTOM_PARAMETERS_GROUPS_COMPONENTS_MAPPING } from '../../../../utils/scenarioParameters/custom/ParametersGroupsComponentsMapping';

const _hasOnlyHiddenParameters = (group) => {
  return (
    group.parameters.filter((parameter) => (ConfigUtils.getParameterAttribute(parameter, 'hidden') ?? false) !== true)
      .length === 0
  );
};

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
    if (
      ConfigUtils.getParametersGroupAttribute(parametersGroupMetadata, 'hidden') === true ||
      _hasOnlyHiddenParameters(parametersGroupMetadata)
    ) {
      parametersGroupMetadata.hidden = true;
      parametersGroupMetadata.tab = null;
      continue;
    }

    const tabFactory = CUSTOM_PARAMETERS_GROUPS_COMPONENTS_MAPPING[parametersGroupMetadata.id] || ScenarioParametersTab;
    // 'name' property helps distinguish React components from factories; we also need to check in WrappedComponent
    // for components connected to redux
    if ('name' in tabFactory || (tabFactory?.WrappedComponent && 'name' in tabFactory.WrappedComponent)) {
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

  const visibleGroups = parametersGroupsMetadata.filter((group) => group.hidden !== true);
  return <ScenarioParametersTabs userRoles={userRoles} parametersGroupsMetadata={visibleGroups} />;
};

ScenarioParametersTabsWrapper.propTypes = {
  parametersGroupsMetadata: PropTypes.array.isRequired,
  userRoles: PropTypes.array.isRequired,
  parametersValuesToRender: PropTypes.object.isRequired,
  setParametersValuesToRender: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
export default ScenarioParametersTabsWrapper;
