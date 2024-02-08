// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { ConfigUtils } from '../../../../utils';
// eslint-disable-next-line max-len
import { CUSTOM_PARAMETERS_GROUPS_COMPONENTS_MAPPING } from '../../../../utils/scenarioParameters/custom/ParametersGroupsComponentsMapping';
import ScenarioParametersTab from './ScenarioParametersTab';
import ScenarioParametersTabs from './ScenarioParametersTabs';

const _hasOnlyHiddenParameters = (group) => {
  return (
    group.parameters.filter((parameter) => (ConfigUtils.getParameterAttribute(parameter, 'hidden') ?? false) !== true)
      .length === 0
  );
};

const ScenarioParametersTabsWrapper = ({ parametersGroupsMetadata, userRoles, context }) => {
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
        context,
      });
    }
    // Factories as a function are not supported
    else {
      throw new Error(`
        Factories as a function are no longer supported for scenario parameter tab.
        Please update your factories to React components (see migration guide for further instructions)
      `);
    }
  }

  const visibleGroups = parametersGroupsMetadata.filter((group) => group.hidden !== true);
  return <ScenarioParametersTabs userRoles={userRoles} parametersGroupsMetadata={visibleGroups} />;
};

ScenarioParametersTabsWrapper.propTypes = {
  parametersGroupsMetadata: PropTypes.array.isRequired,
  userRoles: PropTypes.array.isRequired,
  context: PropTypes.object.isRequired,
};
export default ScenarioParametersTabsWrapper;
