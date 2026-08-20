// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { TabContext, TabPanel } from '@mui/lab';
import { styled } from '@mui/material';
import { ConfigUtils } from '../../../../utils';
import { hasRequiredProfile, ScenarioParametersTabList } from './ScenarioParametersTabList';

const PlaceholderDiv = styled('div')(({ theme }) => ({ margin: `0 ${theme.spacing(3)}` }));

function _buildTabPanels(userRoles, tabs) {
  const tabPanelComponents = [];
  for (let index = 0; index < tabs.length; index++) {
    const groupMetadata = tabs[index];
    const lockedTab = !hasRequiredProfile(userRoles, groupMetadata.authorizedRoles);
    if (!lockedTab || !ConfigUtils.getParametersGroupAttribute(groupMetadata, 'hideParameterGroupIfNoPermission')) {
      tabPanelComponents.push(
        <TabPanel
          index={index}
          key={groupMetadata.id}
          value={groupMetadata.id}
          sx={{
            maxHeight: 450,
            overflow: 'auto',
          }}
        >
          {groupMetadata.tab}
        </TabPanel>
      );
    }
  }
  return tabPanelComponents;
}

function chooseParametersTab(parametersGroupsMetadata, userRoles) {
  const selectedTabId = '';
  for (const groupMetadata of parametersGroupsMetadata) {
    if (selectedTabId === '') {
      const canViewTab = hasRequiredProfile(userRoles, groupMetadata.authorizedRoles);
      if (canViewTab || !ConfigUtils.getParametersGroupAttribute(groupMetadata, 'hideParameterGroupIfNoPermission')) {
        return groupMetadata?.id;
      }
    }
  }
  return selectedTabId;
}

const ScenarioParametersTabs = ({ parametersGroupsMetadata, userRoles }) => {
  const { t } = useTranslation();
  const [tabs, setTabs] = useState(parametersGroupsMetadata);
  const firstTab = chooseParametersTab(parametersGroupsMetadata, userRoles);
  const [selectedTab, setSelectedTab] = useState(firstTab);

  // Reset selected tab on scenario change
  useEffect(() => {
    setTabs(parametersGroupsMetadata);
    if (parametersGroupsMetadata.find((groupMetadata) => groupMetadata.id === selectedTab) === undefined) {
      setSelectedTab(firstTab);
    }
    // eslint-disable-next-line
  }, [parametersGroupsMetadata]);

  const tabPanels = useMemo(() => _buildTabPanels(userRoles, tabs), [userRoles, tabs]);

  return (
    <div data-cy="scenario-parameters-tabs">
      {tabs.length === 0 ? (
        <PlaceholderDiv data-cy="no-parameters-placeholder">
          {t('genericcomponent.text.scenario.parameters.placeholder', 'No parameters to edit.')}
        </PlaceholderDiv>
      ) : (
        <TabContext value={selectedTab}>
          <ScenarioParametersTabList
            tabs={tabs}
            userRoles={userRoles}
            t={t}
            selectedTab={selectedTab}
            onTabChange={(event, newTab) => setSelectedTab(newTab)}
          />
          {tabPanels}
        </TabContext>
      )}
    </div>
  );
};

ScenarioParametersTabs.propTypes = {
  parametersGroupsMetadata: PropTypes.array.isRequired,
  userRoles: PropTypes.array.isRequired,
};

export default ScenarioParametersTabs;
